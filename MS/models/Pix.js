/* eslint-disable camelcase */
const {DataTypes, Sequelize} = require('sequelize')

const db = new Sequelize('mysql://root:@localhost:3306/ms_lubycash')

const Pix = db.define('pix', {
  id:{
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  cpf_origin:{
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
  cpf_destination:{
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
  pix_value:{
    type: DataTypes.FLOAT,
    allowNull: false
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


module.exports = Pix