"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client_AccountModel = void 0;
/* eslint-disable camelcase */
const dist_1 = require("sequelize/dist");
const db_1 = require("../db");
exports.Client_AccountModel = db_1.db.define('client_account', {
    id: {
        type: dist_1.DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    user_id: {
        type: dist_1.DataTypes.INTEGER,
        references: {
            model: 'clients',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
    },
    current_balance: {
        type: dist_1.DataTypes.NUMBER
    },
    createdAt: {
        type: dist_1.DataTypes.DATE,
    },
    updatedAt: {
        type: dist_1.DataTypes.DATE,
    }
});
