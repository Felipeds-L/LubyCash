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
  const consumer_client = kafka.consumer({ groupId: 'user-group', fromBeginning: false })
  const consumer_account = kafka.consumer({ groupId: 'account-group', fromBeginning: false })
  
  async function runClient(){
    
    await consumer_client.connect()
    await consumer_client.subscribe({ topic: 'user'})
    await consumer_client.run({
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
        
      },
    })
  }

  async function runAccount(){
    await consumer_account.connect()
    await consumer_account.subscribe({ topic: 'account'})
    await consumer_account.run({
      eachMessage: async({ message }: any) => {
        const email = message.value.toString()
        const emailJSON = JSON.parse(email)
        console.log(emailJSON.client.email)
        const client = await ClientModel.findOne({
          where:{
            email: emailJSON.client.email
          } 
        })
        console.log(client)
        // const clientJSON = client?.toJSON()
        // console.log(clientJSON.id)
         
        // await Client_AccountModel.create({
        //   client_id: clientJSON.id,
        //   current_balance: 200
        // })
      }
    })
  }
  
  runClient().catch(console.error)
  runAccount().catch(console.error)
});

 