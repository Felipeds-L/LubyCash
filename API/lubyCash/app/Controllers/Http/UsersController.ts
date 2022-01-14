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
const producer_account = kafka.producer()


export default class UsersController {
  public async index({}: HttpContextContract) {}

  public async store({ request, response }: HttpContextContract) {
    await producer_client.connect()
    await producer_account.connect()

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
        if(data.average_salary > 500){
          await UserStatus.create({
            user_id: user.id,
            status_id: 1
          })

          await UserLevelAccess.create({
            level_id: data.level_access,
            user_id: user.id
          })

          await producer_client.send({
            topic: 'user',
            messages: [
              { value: JSON.stringify(message) },
            ],
          })

          const message_account = {
            client:{
              email: data.email
            }
          }

          await producer_account.send({
            topic: 'account',
            messages:[
              {value: JSON.stringify(message_account)}
            ]
          })

          await producer_client.disconnect()
          await producer_account.disconnect()
        }else{
          await UserStatus.create({
            user_id: user.id,
            status_id: 2
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
