import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import UserStatus from 'App/Models/UserStatus'
import UserLevelAccess from 'App/Models/UserLevelAccess'

const { Kafka } = require('kafkajs')

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092', 'kafka:29092']
})
const producer_client = kafka.producer()
const producer_status = kafka.producer()


export default class UsersController {
  public async index({}: HttpContextContract) {}

  public async store({ request, response }: HttpContextContract) {
    await producer_client.connect()
    await producer_status.connect()

    try{
      const data = await request.only(
        ['full_name', 'email', 'phone', 'cpf_number', 'address', 'city', 'state', 'zipcode', 'average_salary', 'level_access']
      );
      try{
        await User.create({
          email: data.email
        })
        const user = await User.findByOrFail('email', data.email)

        const message = {
          user: {
            full_name: data.full_name,
            email: data.email,
            phone: data.phone,
            cpf_number: data.cpf_number,
            address: data.address,
            city: data.city,
            state: data.state,
            zipcode: data.zipcode,
            average_salary: data.average_salary,
          }
        }

        // this if check the datas and aprove or deni the user
        if(data.average_salary > 500){
          // insert a user status as aproved = 1
          await UserStatus.create({
            user_id: user.id,
            status_id: 1
          })

          const message_status = {
            status:{
              user_email: data.email,
              username: data.full_name,
              status_code: 1
            }
          }

          await producer_status.send({
            topic: 'status',
            messages: [
              { value: JSON.stringify(message_status)}
            ]
          })

          await producer_status.disconnect()
          // give the user a level access, default as client
          await UserLevelAccess.create({
            level_id: data.level_access,
            user_id: user.id
          })

          // send the client's data from the consumer on MS
          await producer_client.send({
            topic: 'user',
            messages: [
              { value: JSON.stringify(message) },
            ],
          })

          await producer_client.disconnect()

        }else{
          // give the user a level 2 of status, that's mean denied
          await UserStatus.create({
            user_id: user.id,
            status_id: 2
          })

          const message_status = {
            status:{
              user_email: data.email,
              username: data.full_name,
              status_code: 0
            }
          }

          await producer_status.send({
            topic: 'status',
            messages: [
              { value: JSON.stringify(message_status)}
            ]
          })
        }

        return response.status(200).json({Created: true})
      }catch{
        return response.status(400).json({Message: 'Error on create the user, please try it again later!'})
      }
    }catch{
      return response.status(400).json({Message: 'Error on receive datas from the request, check the datas that your are passing!'})
    }

  }

  public async show({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
