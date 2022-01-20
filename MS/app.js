const express = require('express')
const Consumer = require('./kafkas/Consumers')
const routes = require('./routes')

const app = express()
app.use(express.json())
app.use(routes)

app.listen(3000)

const consumer = new Consumer();
consumer.consume('create-client')