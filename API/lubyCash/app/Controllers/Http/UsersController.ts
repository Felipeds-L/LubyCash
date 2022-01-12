import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

const { Kafka } = require('kafkajs')

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092', 'kafka:29092']
})
const producer = kafka.producer()


export default class UsersController {
  public async index({}: HttpContextContract) {}

  public async store({ request, response }: HttpContextContract) {
    await producer.connect()

    try{
      const data = await request.only(
        ['full_name', 'email', 'phone', 'cpf_number', 'address', 'city', 'state', 'zipcode', 'average_salary']
      );
      try{
        await User.create({
          email: data.email
        })
        // const user = await User.findByOrFail('email', data.email)
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

        await producer.send({
          topic: 'create-user',
          messages: [
            { value: JSON.stringify(message) },
          ],
        })

        await producer.disconnect()
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
