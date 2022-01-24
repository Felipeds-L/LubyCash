/* eslint-disable camelcase */
const { Op } = require('sequelize');
const ClientAccount = require('../models/Client_Account');
const Pix = require('../models/Pix');

module.exports = {
  async store(req, res){
    const { client_from, client_to, value} = req.body


    const account_from = await ClientAccount.findOne({where: { client_cpf: client_from}})
    const account_to = await ClientAccount.findOne({where: {client_cpf: client_to}})

    if(!account_from){
      return res.json({Error: 'The cpf of origin_account is not valid!'})
    }else if(!account_to){
      return res.json({Error: 'The cpf of distination_account is not valid!'})
    }else if(account_from.current_balance < value){
      return res.json({Error: 'You do not have money enouth in your account to made this pix!'})
    }else{
      account_from.current_balance -= value
      account_to.current_balance += value

      await account_from.save()
      await account_to.save()
      
      const transaction = await Pix.create({
        cpf_origin: client_from,
        cpf_destination: client_to,
        pix_value: value
      })
      
      return res.json({Transfered: true, Transaction: transaction})
    }
  },

  async extract(req, res){

    const { client, date_from, date_to }= req.body

    if(client === null){
      return res.json({Message: 'specify a client!'})
    }

    if(date_from === 'undefined' && date_to === 'undefined'){
      
      const pixes = await Pix.findAll({
      where:{
        [Op.or]: [{cpf_origin: client}, [{cpf_destination: client}]]
      }
    })
      return res.json({Extrato: pixes})
    }

    const init_day = new Date(date_from)
    const ended_day = new Date(date_to)
    ended_day.setDate(ended_day.getDate()+1)
    const pixes = await Pix.findAll({
      where:{
        createdAt: { [Op.between]: [init_day, ended_day] },
        [Op.or]: [{cpf_origin: client}, [{cpf_destination: client}]]
      }
    })

    return res.json({Extrato: pixes})
  }
}