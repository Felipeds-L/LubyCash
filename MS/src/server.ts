/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
import express from 'express';
import { ClientModel } from './database/models/ClienteModel';
const { Kafka } = require('kafkajs');
const app = express();




app.listen(3000, () => {
  const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092', 'kafka:29092']
  })
  const consumer = kafka.consumer({ groupId: 'test-group' })
  
  async function run(){
    
    await consumer.connect()
    await consumer.subscribe({ topic: 'create-user'})
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
        
      },
    })
  }
  
  run().catch(console.error)
});

 