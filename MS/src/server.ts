/* eslint-disable camelcase */
import express from 'express';

import { ClientModel } from './database/models/ClienteModel';
import { Client_AccountModel } from './database/models/Client_AccountModel';
const { Kafka } = require('kafkajs');
const app = express();

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092', 'kafka:9092']
})
const consumer = kafka.consumer({ groupId: 'test-group' })


async function run(){
  
  await consumer.connect()
  await consumer.subscribe({ topic: 'create-user'})
  await consumer.run({
    eachMessage: async ({ message }: any) => {
      const new_user = message.value.toString()
      const new_userJSON = JSON.parse(new_user)
      const { full_name, email, phone, cpf_number, address, city, state, zipcode, average_salary } = new_userJSON.user
      if(average_salary >= 500){
        // user are beeing aproved, yet its necessary create de function to insert the user in the client table
        console.log(`User ${full_name}, your salary ${average_salary} is higher than 500, so you'll be aproved on our bank!`)

        await ClientModel.create({
          full_name: full_name,
          email: email,
          phone: phone,
          cpf_number: cpf_number,
          address: address,
          city: city,
          state: state,
          zipcode: zipcode,
          average_salary: average_salary
        })
        const client = await ClientModel.findAll({
          attributes: ['id'],
          where:{
            email: email
          }
        })
        await Client_AccountModel.create({
          user_id: client,
          current_account: 200
        })
      }else{
        console.log(`User ${full_name}, your salary ${average_salary} is lower than 500, 'cause that, unfortunantly we can't aprove you`)
      }
    },
  })
}

run()


app.listen(3000);

