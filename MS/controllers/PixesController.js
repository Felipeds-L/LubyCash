/* eslint-disable camelcase */
const ClientAccount = require('../models/Client_Account');
const Pix = require('../models/Pix')

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
  }
}