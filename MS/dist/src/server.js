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
const nodemailer = require("nodemailer");
const app = (0, express_1.default)();
app.listen(3000, () => {
    const kafka = new Kafka({
        clientId: 'my-app',
        brokers: ['localhost:9092', 'kafka:29092']
    });
    const consumer_client = kafka.consumer({ groupId: 'user-group' });
    const consumer_status = kafka.consumer({ groupId: 'user-group ' });
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
    async function runStatus() {
        await consumer_status.connect();
        await consumer_status.subscribe({ topic: 'status' });
        await consumer_status.run({
            eachMessage: async ({ message }) => {
                const user_status = JSON.parse(message.value.toString());
                const { username, status_code, user_email } = user_status.status;
                console.log(username, status_code, user_email);
                sendEmail(user_email, status_code, username);
            }
        });
    }
    runClient().catch(console.error);
    runStatus().catch(console.error);
    async function sendEmail(email, status, username) {
        const transport = nodemailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "9665e746ab93cf",
                pass: "6acd26e0dc004d"
            }
        });
        if (status === 1) {
            await transport.sendMail({
                from: 'srMilk@mail.com',
                to: email,
                subject: `Status of solicitation from ${username}`,
                text: `Hello ${username}, we congrats you! You have been aproved to be a client of our bank! `,
                html: `<b>Hello ${username}, we congrats you! You have been aproved to be a client of our bank!</b>`,
            });
        }
        else {
            await transport.sendMail({
                from: 'srMilk@mail.com',
                to: email,
                subject: `Status of solicitation from ${username}`,
                text: `Hello ${username}, unfortunatly we can not acept your appointment to our bank.`,
                html: `<b>Hello ${username}, unfortunatly we can not acept your appointment to our bank.</b>`,
            });
        }
    }
});
