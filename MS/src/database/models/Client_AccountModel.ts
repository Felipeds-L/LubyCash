/* eslint-disable camelcase */
import { DataTypes } from "sequelize/dist";
import { db } from "../db";

export const Client_AccountModel = db.define('client_account', {
  id:{
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  user_id:{
    type: DataTypes.INTEGER,
    references:{
      model: 'clients',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
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