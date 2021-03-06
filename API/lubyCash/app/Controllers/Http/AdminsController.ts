import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import UserLevelAccess from 'App/Models/UserLevelAccess'
import UserStatus from 'App/Models/UserStatus';
const axios = require('axios').default;

export default class AdminsController {
  public async index({}: HttpContextContract) {}

  public async store({ auth, request, response}: HttpContextContract) {
    try{
      const data = await request.only(
        ['password', 'email', 'cpf_number', 'level_access']
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
          cpf_number: data.cpf_number,
          password: data.password
        })
        const newAdmin = await User.findByOrFail('email', data.email)

        await UserLevelAccess.create({
          user_id: newAdmin.id,
          level_id: 2
        })

        await UserStatus.create({
          user_id: newAdmin.id
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


  public async extract({ auth, request, response}: HttpContextContract){
    const user_level = await UserLevelAccess.findByOrFail('user_id', auth.user?.id)
    if(user_level.level_id === 2){
      const {client, date_from, date_to} = request.qs()
      const api = await axios({
        url: `http://localhost:3000/clients/extract?client=?${client}&date_from=${date_from}&date_to=${date_to}`,
        method: 'get',
        data: {
          client: client,
          date_from: date_from,
          date_to: date_to
        }
      })

      return response.status(200).json({Message: api.data})
    }else{
      return response.status(400).json({Error: 'Only Administrators can see all the clients!'})
    }
  }
}
