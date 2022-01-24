const express = require('express');
const ClientsController = require('./controllers/ClientsController');
const PixesController = require('./controllers/PixesController');
const routes = express.Router();

routes.get('/admin/clients', ClientsController.status);
routes.get('/clients', ClientsController.index);
routes.get('/all-clients', ClientsController.all_clients);
routes.post('/clients/pix', PixesController.store);
routes.get('/clients/extract', PixesController.extract);

module.exports = routes;