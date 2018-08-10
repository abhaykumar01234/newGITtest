var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const exphbs= require('express-handlebars');

var authenticatedRoutes = require('./routes/authenticated_routes.js');

var app = express();

app.engine('handlebars',exphbs({defaultLayout:"main"}));
app.set('view engine','handlebars');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', authenticatedRoutes);

module.exports = app;
