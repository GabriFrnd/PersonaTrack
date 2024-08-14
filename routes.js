const express = require('express');
const route = express.Router(); 

const home_controller = require('./src/controllers/homeController');
const login_controller = require('./src/controllers/loginController');

const contato_controller = require('./src/controllers/contatoController');
const { login_required } = require('./src/middlewares/middleware');

route.get('/', home_controller.index); 
route.get('/login', login_controller.index); 

route.post('/login/register', login_controller.register); 
route.post('/login/login', login_controller.login); 

route.get('/login/logout', login_controller.logout); 
route.get('/contato', login_required, contato_controller.index); 

route.post('/contato/register', login_required, contato_controller.register); 
route.get('/contato/:id', login_required, contato_controller.edit_index);

route.post('/contato/edit/:id', login_required, contato_controller.edit); 
route.get('/contato/delete/:id', login_required, contato_controller.delete); 

module.exports = route;