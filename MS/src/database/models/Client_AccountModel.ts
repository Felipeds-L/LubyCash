/* eslint-disable camelcase */
import { DataTypes } from "sequelize";
import { db } from "../db";

export const Client_AccountModel = db.define('client_accounts', {
  id:{
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  client_owner:{
    type: DataTypes.INTEGER,
    references:{
      model: 'clients',
      key: 'email'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  current_balance:{
    type: DataTypes.NUMBER
  },
  createdAt:{
    type: DataTypes.DATE,
  },
  updatedAt:{
    type: DataTypes.DATE,
  }

})