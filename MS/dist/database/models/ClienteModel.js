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
    user_id: {
        type: dist_1.DataTypes.INTEGER,
        allowNull: false
    }
});
