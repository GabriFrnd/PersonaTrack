require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect(process.env.CONNECTIONSTRING)
    .then(() => {
        app.emit('Pronto');
    })
    .catch(e => console.log(e));

const session = require('express-session'); 
const MongoStore = require('connect-mongo'); 

const flash = require('connect-flash'); 
const path = require('path');

const helmet = require('helmet'); 
const csrf = require('csurf'); 

const routes = require('./routes');
const { middleware_global, check_csrf, csrf_middleware } = require('./src/middlewares/middleware');

app.use(helmet()); 
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));

const session_options = session({ 
    secret: 'Um segredo.',
    store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }), 
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
});

app.use(session_options); 
app.use(flash());

app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

app.use(csrf()); 
app.use(middleware_global);

app.use(check_csrf);
app.use(csrf_middleware); 

app.use(routes);

app.on('Pronto', () => {
    app.listen(3000, () => {
        console.log('Servidor executando com sucesso!');
        console.log('Acessar servidor: http://localhost:3000');
    });
});