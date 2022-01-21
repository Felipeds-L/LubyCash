const express = require('express');
const ClientsController = require('./controllers/ClientsController');
const PixesController = require('./controllers/PixesController');
const routes = express.Router();

routes.get('/clients', ClientsController.index);
routes.post('/clients/pix', PixesController.store)

module.exports = routes;