"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_StatusModel_1 = require("./database/models/User_StatusModel");
const { Kafka } = require('kafkajs');
const app = (0, express_1.default)();
const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092', 'kafka:9092']
});
const consumer = kafka.consumer({ groupId: 'test-group' });
async function run() {
    await consumer.connect();
    await consumer.subscribe({ topic: 'test-topic', fromBeginning: true });
    await consumer.run({
        eachMessage: async ({ message }) => {
            const new_user = message.value.toString();
            const new_userJSON = JSON.parse(new_user);
            const { salary, user_id } = new_userJSON.user;
            let status = false;
            if (salary >= 500) {
                status = true;
                console.log(`User ${user_id}, your salary ${salary} is higher than 500, so you'll be aproved on our bank!`);
                await User_StatusModel_1.User_StatusModel.create({ user_id: user_id, status: status });
            }
            else {
                status = false;
                console.log(`User ${user_id}, your salary ${salary} is lower than 500, 'cause that, unfortunantly we can't aprove you`);
                await User_StatusModel_1.User_StatusModel.create({ user_id: user_id, status: status });
            }
        },
    });
}
run();
app.listen(3000);
