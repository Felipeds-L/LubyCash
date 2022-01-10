const express = require('express')
const bodyParse = require('body-parser')
const controllers = require('./controllers')
const server = express()


server.use(bodyParse.json());

const { Kafka } = require('kafkajs')

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092', 'kafka:9092']
})
const consumer = kafka.consumer({ groupId: 'test-group' })


async function run(){
  
  await consumer.connect()
  await consumer.subscribe({ topic: 'test-topic', fromBeginning: true })
  await consumer.run({
    eachMessage: async ({ message }) => {
      
      console.log(message.value.toString())
    },
  })
}

run().catch(console.error())

server.get('/', (req, res) => {
  return res.status(200).json({Message: 'Hello World'})
})

server.use('/clients', controllers.clients)

server.listen(3000)