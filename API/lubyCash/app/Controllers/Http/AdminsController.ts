import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import UserLevelAccess from 'App/Models/UserLevelAccess'
import UserStatus from 'App/Models/UserStatus';
const axios = require('axios').default;

const { Kafka } = require('kafkajs')

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092', 'kafka:29092']
})

const consumer_ShowClients = kafka.consumer({ groupId: 'send_clients', fromBeginning: true})


export default class AdminsController {
  public async index({}: HttpContextContract) {}

  public async store({ auth, request, response}: HttpContextContract) {
    try{
      const data = await request.only(
        ['full_name', 'password', 'email', 'phone', 'cpf_number', 'address', 'city', 'state', 'zipcode', 'average_salary', 'level_access']
      );

      const logged = auth.user?.id

      const user_logged = await User.findOrFail(logged)

      const user_levels = await UserLevelAccess.query().where('user_id', user_logged.id)
      let isAdmin = false

      user_levels.forEach((user) => {
        if(user.level_id === 2){
          isAdmin = true
        }
      })

      if(isAdmin){
        await User.create({
          email: data.email,
          password: data.password
        })
        const newAdmin = await User.findByOrFail('email', data.email)

        await UserLevelAccess.create({
          user_id: newAdmin.id,
          level_id: 2
        })

        return response.status(200).json({Created: true, message: 'new admin has been stored'})
      }else{
        return response.status(403).json({Created: false, Message: 'Only Administrators can add another adminsitrator!'})
      }
    }catch{
      return response.status(403).json({Error: 'Can not create a admin user'})
    }
  }

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}

  public async showClients({auth, params, response}: HttpContextContract) {
    try{
      if(this.isAdmin(auth.user?.id)){
        const status = params.status


        if(status == 1){

          const users_email: any[] = []
          const users_aproved = await UserStatus.query().select('user_id').where('status_id', 1)

          for(let x =0; x< users_aproved.length; x++){
            const user = await User.findOrFail(users_aproved[x].user_id)
            users_email.push(user.email)

          }

          const producer = kafka.producer()

          await producer.connect()
          await producer.send({
            topic: 'showClients',
            messages: [
              { value: JSON.stringify(users_email) },
            ],
          })

          await producer.disconnect()

          await consumer_ShowClients.subscribe({topic: 'ClientsShow', fromBeginning: true})
          // falta ajustar isso

          await consumer_ShowClients.run({
            eachMessage: async ({message}) => {
              JSON.parse(message.value.toString())
            }
          })

        }else{
          const list_users: any[] = []
          const users_denied = await UserStatus.query().select('user_id').where('status_id', 2)
          for(let x =0; x< users_denied.length; x++){
            const user = await User.findOrFail(users_denied[x].user_id)
            list_users.push(user)
          }
          return  response.status(200).json({Users: list_users})
        }

      }

    }catch{
      return response.status(404).json({Error: 'Deu erro'})
    }
  }

  public async isAdmin(user_id){

    const logged = user_id
    const user_logged = await User.findOrFail(logged)
    const user_levels = await UserLevelAccess.query().where('user_id', user_logged.id)
    let isAdmin = false

    user_levels.forEach((user) => {
      if(user.level_id === 2){
        isAdmin = true
      }
    })

    return isAdmin

  }

  public addInList(valores, lista){
    for(let x=0;x<valores.length;x++){
      lista.push(valores[x])
    }
  }

}
