/* eslint-disable camelcase */
const Client = require('../models/Client');
// const { Op } = require('sequelize');
module.exports = {
  async index(req, res) {
    const { status, statusDate } = req.query;

    if (status === 0) {
      const clients = await Client.findAll();
      return res.json(clients);
    }
    if (statusDate === 0) {
      const clients = await Client.findAll({ where: { status } });
      return res.json(clients);
    }

    const next_day = new Date(statusDate);
    next_day.setDate(next_day.getDate() + 1);
    const clients = await Client.findAll({
      where: {
        status: status
      }
      // where: { status, created_at: { [Op.between]: [statusDate, next_day] } },
    });
    return res.json(clients);
  },
};
