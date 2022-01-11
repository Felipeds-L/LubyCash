"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientModel = void 0;
const dist_1 = require("sequelize/dist");
const db_1 = require("../db");
exports.ClientModel = db_1.db.define('clients', {
    id: {
        type: dist_1.DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    full_name: {
        type: dist_1.DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: dist_1.DataTypes.STRING
    },
    phone: {
        type: dist_1.DataTypes.STRING,
        allowNull: true
    },
    cpf_number: {
        type: dist_1.DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: dist_1.DataTypes.STRING
    },
    city: {
        type: dist_1.DataTypes.STRING
    },
    state: {
        type: dist_1.DataTypes.STRING
    },
    zipcode: {
        type: dist_1.DataTypes.STRING
    },
    average_salary: {
        type: dist_1.DataTypes.NUMBER,
        allowNull: false
    },
    createdAt: {
        type: dist_1.DataTypes.DATE,
    },
    updatedAt: {
        type: dist_1.DataTypes.DATE,
    }
});
