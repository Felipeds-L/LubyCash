"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
const express_1 = __importDefault(require("express"));
const ClienteModel_1 = require("./database/models/ClienteModel");
const Client_AccountModel_1 = require("./database/models/Client_AccountModel");
const { Kafka } = require('kafkajs');
const app = (0, express_1.default)();
app.listen(3000, () => {
    const kafka = new Kafka({
        clientId: 'my-app',
        brokers: ['localhost:9092', 'kafka:29092']
    });
    const consumer = kafka.consumer({ groupId: 'test-group' });
    async function run() {
        await consumer.connect();
        await consumer.subscribe({ topic: 'create-user' });
        await consumer.run({
            eachMessage: async ({ message }) => {
                const user = message.value.toString();
                const userJSON = JSON.parse(user);
                const { full_name, email, phone, cpf_number, address, city, state, zipcode, average_salary } = userJSON.user;
                await ClienteModel_1.ClientModel.create({
                    full_name: full_name,
                    email: email,
                    phone: phone,
                    cpf_number: cpf_number,
                    address: address,
                    city: city,
                    state: state,
                    zipcode: zipcode,
                    average_salary: average_salary
                });
                const client = await ClienteModel_1.ClientModel.findOne({
                    where: {
                        'email': email
                    }
                });
                const clientJSON = client === null || client === void 0 ? void 0 : client.toJSON();
                await Client_AccountModel_1.Client_AccountModel.create({
                    client_id: clientJSON.id,
                    current_balance: 200
                });
            },
        });
    }
    run().catch(console.error);
});
