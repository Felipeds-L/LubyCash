"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable camelcase */
const express_1 = __importDefault(require("express"));
const { Kafka } = require('kafkajs');
const app = (0, express_1.default)();
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
            console.log({ message: message.value.toString() });
        },
    });
}
run().catch(console.error);
app.listen(3000);
