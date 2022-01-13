/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
import express from 'express';
import { ClientModel } from './database/models/ClienteModel';
import { Client_AccountModel } from './database/models/Client_AccountModel';
const { Kafka } = require('kafkajs');
const app = express();

app.listen(3000, () => {
  const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092', 'kafka:29092']
  })
  const consumer = kafka.consumer({ groupId: 'user-group', fromBeginning: false })
  
  async function run(){
    
    await consumer.connect()
    await consumer.subscribe({ topic: 'user'})
    await consumer.run({
      eachMessage: async ({ message }: any) => {
        const user = message.value.toString()
        const userJSON = JSON.parse(user)
        const { full_name, email, phone, cpf_number, address, city, state, zipcode, average_salary} = userJSON.user
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
        // const client = await ClientModel.findOne({
        //   where:{
        //     'email': email
        //   }
        // })
        // const clientJSON = client?.toJSON()
        // await Client_AccountModel.create({
        //   client_id: clientJSON.id,
        //   current_balance: 200
        // })
      },
    })
  }
  
  run().catch(console.error)
});

 