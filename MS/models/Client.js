const {DataTypes, Sequelize} = require('sequelize')

const db = new Sequelize('mysql://root:@localhost:3306/ms_lubycash')

const ClientModel = db.define('clients', {
  id:{
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  full_name:{
    type: DataTypes.STRING,
    allowNull: false
  },
  email:{
    type: DataTypes.STRING
  },
  phone:{
    type: DataTypes.STRING,
    allowNull: true
  },
  cpf_number:{
    type: DataTypes.STRING,
    allowNull: false
  },
  address:{
    type: DataTypes.STRING
  },
  city:{
    type: DataTypes.STRING
  },
  state:{
    type: DataTypes.STRING
  },
  zipcode:{
    type: DataTypes.STRING
  },
  average_salary:{
    type: DataTypes.NUMBER,
    allowNull: false
  },
  status:{
    type: DataTypes.BOOLEAN,
  },
  createdAt:{
    type: DataTypes.DATE,
  },
  updatedAt:{
    type: DataTypes.DATE,
  }

})

module.exports = ClientModel