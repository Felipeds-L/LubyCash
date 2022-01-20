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
const producer_pix = kafka.producer()
const producer_account = kafka.producer()


export default class UsersController {
  public async index({}: HttpContextContract) {}

  public async storeAdmin({request, response, auth }: HttpContextContract){
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

  public async store({ request, response }: HttpContextContract) {
    await producer_client.connect()
    await producer_status.connect()

    try{
      const data = await request.only(
        ['full_name', 'password', 'email', 'phone', 'cpf_number', 'address', 'city', 'state', 'zipcode', 'average_salary', 'level_access']
      );
      try{

        await User.create({
          email: data.email,
          password: data.password
        })

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

        const user = await User.findByOrFail('email', data.email)

        // this if check the datas and aprove or deni the user
        if(data.average_salary >= 500){
          console.log('entrou')
          // insert a user status as aproved = 1
          await UserStatus.create({
            user_id: user.id
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

          await UserLevelAccess.create({
            level_id: data.level_access,
            user_id: user.id
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


  public async madePix({ auth, request }: HttpContextContract){
    const user_logged = await User.findOrFail(auth.user?.id);
    const status = await UserStatus.query().select('status_id').where('user_id', user_logged.id)
    let isClient = false
    status.forEach((user) => {
      if(user.status_id === 1){
        isClient = true
      }
    })

    if(isClient){
      const data = await request.only(['cpf_from', 'cpf_to', 'pix_value'])
      await producer_pix.connect()
      await producer_pix.send({
        topic: 'pix',
        messages: [
          {value: JSON.stringify(data)}
        ]
      })

    }
    // await producer_pix.disconnect()
  }

  public async InAccount({ auth, request}: HttpContextContract ) {
    const data = await request.only(['value_to_add', 'operation'])
    const user_logged = await User.findOrFail(auth.user?.id)
    const message = {
      datas: {
        values: data.value_to_add,
        operation: data.operation,
        user: user_logged.email
      }
    }
    await producer_account.connect()
    await producer_account.send({
      topic: 'account',
      messages: [
        {value: JSON.stringify(message)}
      ]
    })

    // await producer_account.disconnect()

  }
}
