/* eslint-disable camelcase */
const { Kafka } = require("kafkajs")
const Client = require('../models/Client')
const Client_Account = require('../models/Client_Account')
const Producer = require('./Producers')
const nodemailer = require('nodemailer')

class Consumers{
  constructor(){
    const kafka = new Kafka({
      brokers: ['localhost:9092', 'kafka:29092']
    })
    this.consumer = kafka.consumer({ groupId: 'ms-clients'})
  }


  async consume(topic){
    await this.consumer.connect();
    await this.consumer.subscribe({topic: topic})
    await this.consumer.run({
      eachMessage: async ({topic, message}) => {
        if(topic === 'create-client'){
          const client_data = JSON.parse(message.value);
          
          if(
            await Client.findOne({where:{ cpf_number: client_data.cpf_number}})
          ){
            const producer = new Producer()
            producer.produce('status-client', {
              is_Approved: false,
              error: 'This cpf is already a client, and exists in our database. Check it and try it again!',
              status: 400
            });
          }else{
            if(client_data.average_salary >= 500){
              const client = await Client.create({
                full_name: client_data.full_name,
                email: client_data.email,
                phone: client_data.phone,
                cpf_number: client_data.cpf_number,
                address: client_data.address,
                city: client_data.city,
                state: client_data.state,
                zipcode: client_data.zipcode,
                average_salary: client_data.average_salary,
                status: 1
              });
              
              await Client_Account.create({
                client_cpf: client_data.cpf_number,
                current_balance: 200
              })
              
              const producer = new Producer()
              
              producer.produce('status-client', {
                is_Approved: true, 
                client: client
              })

              sendEmail(client_data.email, true)

              
            }else{
              const producer = new Producer()

              const client_dennied = await Client.create({
                full_name: client_data.full_name,
                email: client_data.email,
                phone: client_data.phone,
                cpf_number: client_data.cpf_number,
                address: client_data.address,
                city: client_data.city,
                state: client_data.state,
                zipcode: client_data.zipcode,
                average_salary: client_data.average_salary,
                status: 0
              });
              producer.produce('status-client', {
                is_Approved: false,
                user_dennied: client_dennied
              })

              sendEmail(client_data.email, false)
            }
          }
        }
      }
    })
  }
}

function sendEmail(email, status){
  const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "9665e746ab93cf",
      pass: "6acd26e0dc004d"
    }
  });
  
  if(status === true){
    const message = {
      from: "noreply@milk.com",
      to: email,
      subject: "Status - solicitação de cliente",
      text: `Prezado(a) ${email}. \n\n. Voce foi aprovado em nosso banco!`,
      html: `<p>Prezado(a) ${email}. \n\n. Voce foi aprovado em nosso banco!</p>`
    };

    transport.sendMail(message, function(err) {
      if(err){
        return {
          erro: true,
          message: "Email can't bee sent"
        }
      }
    })
    return {
      error: false,
      message: 'Email sent correctly'
    }
  }else{

    const message = {
      from: "noreply@milk.com",
      to: email,
      subject: "Status - solicitação de cliente",
      text: `Prezado(a) ${email}. \n\n. Voce foi não foi aprovado em nosso banco!`,
      html: `<p>Prezado(a) ${email}. \n\n. Voce não foi aprovado em nosso banco!</p>`
    };

    transport.sendMail(message, function(err) {
      if(err){
        return {
          erro: true,
          message: "Email can't bee sent"
        }
      }
    })
    return {
      error: false,
      message: 'Email sent correctly'
    }
  }
    
}
module.exports = Consumers