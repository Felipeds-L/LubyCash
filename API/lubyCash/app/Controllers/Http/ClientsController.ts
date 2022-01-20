import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import UserStatus from 'App/Models/UserStatus'
import { Kafka } from 'kafkajs'
import axios from 'axios'

export default class ClientsController{
  public async store({ auth, request, response}: HttpContextContract){
    const user_logged = await User.findOrFail(auth.user?.id)
    const user_status = await UserStatus.findByOrFail('user_id', user_logged.id)
    const kafka = new Kafka({
      brokers: ['localhost:9092', 'kafka:29092']
    })

    const consumer = kafka.consumer({groupId: 'api-client'})
    const producer = kafka.producer()

    consumer.connect()
    consumer.subscribe({ topic: 'status-client' })

    const data = await request.only(
      ['full_name', 'email', 'phone', 'cpf_number', 'address', 'city', 'state', 'zipcode', 'current_balance', 'average_salary']
    );

    if(user_status.status_id === 1){
      return response.status(400).json({Message: 'You already have been approved to be a client!'})
    }else if(user_status.status_id === 2){
      return response.status(400).json({Message: 'You already tryied to be a client, but you was not accepted!'})
    }else{
      await producer.connect()

      if(user_logged){
        await producer.send({
          topic: 'create-client',
          messages: [
            {
              value: JSON.stringify({
                full_name: data.full_name,
                email: user_logged.email,
                phone: data.phone,
                cpf_number: data.cpf_number,
                address: data.address,
                city: data.city,
                state: data.state,
                zipcode: data.zipcode,
                current_balance: data.current_balance,
                average_salary: data.average_salary
              })
            }
          ]
        });

        await producer.disconnect()
      }
    }

    await consumer.run({
      eachMessage: async ({message}) => {
        if(message.value){
          const status_message = JSON.parse(message.value.toString())

          await UserStatus.create({
            user_id: user_logged.id,
            status_id: status_message.is_Approved
          })
        }
      }
    })

    await consumer.disconnect()

    const api = await axios({
      url: "http://localhost:3000/clients?status=1",
      method: 'get'
    })

    if(api.status == 200){
      for(let x=0;x<api.data.length;x++){
        user_status.status_id = 1
        await user_status.save()
        return response.status(200).json({client: api.data[x]})
      }
    }else{
      user_status.status_id = 2
      await user_status.save()
      console.log(api.status)
      return response.status(400).json({message: 'You can not become a client of our bank!'})
    }


  }
}
