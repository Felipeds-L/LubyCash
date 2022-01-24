/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'


Route.group(() => {
  Route.post('/admin', 'AdminsController.store')
  Route.get('/admin/clients', 'ClientsController.indexStatus')
  Route.post('/clients/pix', 'ClientsController.madePix')
  Route.post('/clients/account', 'UsersController.InAccount')
  Route.post('/clients', 'ClientsController.store')
  Route.get('/admin/extrato', 'AdminsController.extract')


}).middleware('auth')


Route.get('/clients', 'ClientsController.index')
Route.resource('/user', 'UsersController')
Route.post('/login', 'AuthController.login')
Route.post('/forgot-password','AuthController.forgotPassword')
Route.post('/reset-password','AuthController.resetPassword')
