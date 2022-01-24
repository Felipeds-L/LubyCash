import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import UserStatus from 'App/Models/UserStatus'
import UserLevelAccess from 'App/Models/UserLevelAccess'
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
    consumer.subscribe({ topic: 'status-client'})

    const data = await request.only(
      ['full_name', 'email', 'phone', 'cpf_number', 'address', 'city', 'state', 'zipcode', 'current_balance', 'average_salary']
    );

    if(user_status.status_id === 1){
      return response.status(400).json({Message: 'You already have been approved to be a client!', user: user_logged})
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
                email: data.email,
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
          console.log(status_message.is_Approved)
          UserStatus.create({
            user_id: user_logged.id,
            status_id: status_message.isApproved
          })
        }
      }
    })

    await consumer.disconnect()

    const status = await UserStatus.findByOrFail('user_id', user_logged.id)
    const user = await User.findOrFail(status.user_id)
    const api = await axios({
      url: `http://localhost:3000/clients?email=${user.email}`,
      method: 'get'
    })
    console.log(api.data)
    if(api.status === 200){
      for(let x=0;x<api.data.length;x++){
        if(api.data[x].status === true){

          status.status_id = 1
          await status.save()
          return response.status(200).json({client: api.data[x]})
        }else{

          status.status_id = 2
          await status.save()
          return response.status(400).json({message: 'You can not become a client of our bank!'})
        }
      }
    }


  }

  public async indexStatus({ auth, request, response}: HttpContextContract){
    const user_level = await UserLevelAccess.findByOrFail('user_id', auth.user?.id)
    if(user_level.level_id === 2){
      const {status, date} = request.qs()
      const api = await axios.get(`http://localhost:3000/admin/clients?status=${status}&date=${date}`)
      return response.status(200).json({Message: api.data})
    }else{
      return response.status(400).json({Error: 'Only Administrators can see all the clients!'})
    }
  }



  public async index({ response }: HttpContextContract){
    const api = await axios.get(`http://localhost:3000/all-clients`)
    return response.status(200).json({Message: api.data})
  }

  public async madePix({auth, request, response}: HttpContextContract){
    const logged = await UserStatus.findByOrFail('user_id', auth.user?.id)
    const data = await request.only(['value', 'client_to'])


    if(logged.status_id === 1){

      const user_logged = await User.findOrFail(auth.user?.id)
      if(user_logged){
        const user_destination = await User.findBy('cpf_number', data.client_to)
        if(user_destination){
          if(user_destination.cpf_number !== user_logged.cpf_number){
            const status_destination = await UserStatus.findBy('user_id', user_destination.id)
            if(status_destination){
              if(status_destination.status_id === 1){
                const api = await axios({
                  url: `http://localhost:3000/clients/pix`,
                  method: 'post',
                  data:{
                    client_from: user_logged.cpf_number,
                    client_to: data.client_to,
                    value: data.value
                  }
                })

                return api.data
              }else{
                return response.status(400).json({Error: `The user whos you're trying to send the pix isn't a client`})
              }
            }
          }else{
            return response.status(400).json({Error: `You can not send a email to yourself`})
          }
        }else{
          return response.status(400).json({Error: `The user whos you're trying to send the pix does not exists`})
        }
      }else{
        return response.status(400).json({Error: 'You have to be logged to sent the pix'})
      }
    }
  }
}
