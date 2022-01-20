/* eslint-disable camelcase */
const {DataTypes, Sequelize} = require('sequelize')

const db = new Sequelize('mysql://root:@localhost:3306/ms_lubycash')

const Client_AccountModel = db.define('client_account', {
  id:{
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  client_cpf:{
    type: DataTypes.STRING,
    allowNull: false,
    references:{
      model: 'clients',
      key: "cpf_number"
    },
    unique: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  current_balance:{
    type: DataTypes.FLOAT,
    allowNull: true,
    default: 200
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: Sequelize.DATE,
    allowNull: false,
  }
});


module.exports = Client_AccountModel