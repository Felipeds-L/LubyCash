const express = require('express')
const bodyParse = require('body-parser')
const controllers = require('./controllers')
const User_Status = require('./models/User_Status')
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
      const new_user = message.value.toString()
      const new_userJSON = JSON.parse(new_user)
      const { salary, user_id } = new_userJSON.user
      if(salary >= 500){
       console.log(`User ${user_id}, your salary ${salary} is higher than 500, so you'll be aproved on our bank!`)
      }else{
        console.log(`User ${user_id}, your salary ${salary} is lower than 500, 'cause that, unfortunantly we can't aprove you`)
      }
    },
  })
}

run().catch(console.error())

server.get('/', (req, res) => {
  return res.status(200).json({Message: 'Hello World'})
})

server.use('/clients', controllers.clients)

server.listen(3000)