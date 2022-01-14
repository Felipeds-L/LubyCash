"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client_AccountModel = void 0;
/* eslint-disable camelcase */
const sequelize_1 = require("sequelize");
const db_1 = require("../db");
exports.Client_AccountModel = db_1.db.define('client_account', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    client_id: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: 'clients',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
    },
    current_balance: {
        type: sequelize_1.DataTypes.NUMBER
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
    }
});
