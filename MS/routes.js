const express = require('express');
const ClientsController = require('./controllers/ClientsController');
const routes = express.Router();

routes.get('/clients', ClientsController.index);


module.exports = routes;