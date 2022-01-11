import { DataTypes } from "sequelize/dist";
import { db } from "../db";

export const ClientModel = db.define('clients', {
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
  createdAt:{
    type: DataTypes.DATE,
  },
  updatedAt:{
    type: DataTypes.DATE,
  }

})