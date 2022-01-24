/* eslint-disable camelcase */
const Client = require('../models/Client');

// const { Op } = require('sequelize');
module.exports = {
  async index(req, res) {
    const { email} = req.query;
  
    const clients = await Client.findAll({
      where: {
        email: email
      }
    });
    return res.json({Client: clients});
  },

  async status(req, res){
    const { status, date } = req.query;
      
    if (date === 0) {
      const clients = await Client.findAll({ where: { status } });
      return res.json(clients);
    }

    const next_day = new Date(date);
    next_day.setDate(next_day.getDate() + 1);
    const clients = await Client.findAll({
      where: {
        status: status
      }
    });
    return res.json(clients);
  },


  async all_clients(req, res){
    const clients = await Client.findAll({
      attributes: ['full_name']
    })

    return res.json({Clients: clients})
  }
};
