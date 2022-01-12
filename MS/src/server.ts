/* eslint-disable camelcase */
import express from 'express';

const { Kafka } = require('kafkajs');
const app = express();

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
      console.log({message: message.value.toString()})
    },
  })
}

run().catch(console.error)


app.listen(3000);

