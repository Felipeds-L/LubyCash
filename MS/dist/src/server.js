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
    const consumer_client = kafka.consumer({ groupId: 'user-group' });
    // const consumer_account = kafka.consumer({ groupId: 'account-group' })
    async function runClient() {
        await consumer_client.connect();
        await consumer_client.subscribe({ topic: 'user' });
        await consumer_client.run({
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
                await Client_AccountModel_1.Client_AccountModel.create({
                    client_owner: email,
                    current_balance: 200
                });
            },
        });
    }
    // async function runAccount(){
    //   await consumer_account.connect()
    //   await consumer_account.subscribe({ topic: 'account'})
    //   await consumer_account.run({
    //     eachMessage: async({ message }: any) => {
    //       const email = message.value.toString()
    //       const emailJSON = JSON.parse(email)
    //       console.log(emailJSON.client.email)
    //       const clients = await Client_AccountModel.create({
    //         client_owner: emailJSON.client.email,
    //         current_balance: 200
    //       })
    //       console.log(clients)
    //     }
    //   })
    // }
    runClient().catch(console.error);
    // runAccount().catch(console.error)
});
