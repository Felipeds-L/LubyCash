"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User_StatusModel = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../db");
exports.User_StatusModel = db_1.db.define('user_status', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false
    }
});
