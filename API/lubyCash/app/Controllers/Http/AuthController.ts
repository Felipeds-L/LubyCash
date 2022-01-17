import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import LevelAccess from 'App/Models/LevelAccess'
import UserLevelAccess from 'App/Models/UserLevelAccess'

const nodemailer = require("nodemailer");

export default class AuthController {
  public async login({auth, request, response}: HttpContextContract){
    try{
      const email = request.input('email')
      const password = request.input('password')

      const user = await User.findByOrFail('email', email)
      const level = await LevelAccess.query().select('level').whereIn('id', UserLevelAccess.query().select('level_id').where('user_id', user.id))

      const token = await auth.use('api').attempt(email, password)
      return response.status(200).json({token: token, user: user.email, level_access: level})
    }catch{
      return response.status(401).json({Error: 'Invalid credential'})
    }
  }


  public async forgotPassword({ request, response}: HttpContextContract){
    const email = await request.only(['email'])
    const user = await User.findByOrFail('email', email.email)
    user.token = (Math.random() * 323242).toString()

    await user.save()

    let transport = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "9665e746ab93cf",
        pass: "6acd26e0dc004d"
      }
    });

    let message = {
      from: "noreply@milk.com",
      to: user.email,
      subject: "Recuperação de Senha",
      text: `Prezado(a) ${user.email}. \n\n segue abaixo informações para que possa recuperar sua senha. \n\n
      Use o token: ${user.token}`,
      html: `<strong>Recuperação de Senha<strong>

      <p>Olá ${user.email}, você solicitou uma recuperação de senha.</p>

      <p>Para dar prosseguimento, utilize o token ${user.token}</p>

      <a href="${request.input('redirec_url')}?token=${user.token}">Reset Password</a>
      `
    };

    transport.sendMail(message, function(err) {
      if(err){
        return response.status(400).json({
          erro: true,
          message: "Email can't bee sent"
        })
      }
    })


    return response.status(200).send({
      error: false,
      message: 'Email sent correctly'
    })
  }

  public async resetPassword({ request, response}: HttpContextContract){
    try{
      const {token, password} = request.all()

      const user = await User.findByOrFail('token', token)
      user.token = '';
      user.password = password
      await user.save()

      return response.status(200).send({Message: {Message: `the password for the user ${user.email} has been changed correctly!`}})
    }catch(err){
      return response.status(err.status).send({Error: {Message: 'Something is wrong, verify the email!'}})
    }
  }

}
