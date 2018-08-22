
globals = {}

oracledb = require('oracledb');
oracledb.outFormat = oracledb.OBJECT;
// oracledb.CURSOR = oracledb.CURSOR;
// oracledb.BIND_OUT = oracledb.BIND_OUT;
oracledb.autoCommit = true;
oracledb.maxRows = 5000;


var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const exphbs= require('express-handlebars');
const favicon = require('serve-favicon');

const DBConnector_lib = require('./server_controllers/dbConnector.js');
const queryDictionary_lib = require('./server_controllers/queryDictionary.js');

var authenticatedRoutes = require('./routes/authenticated_routes.js');

var app = express();



app.engine('handlebars',exphbs({defaultLayout:"main"}));
app.set('view engine','handlebars');

app.use(favicon('public/img/favicon.ico'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

globals.$ = require('jquery-deferred');
globals.db = new DBConnector_lib(new queryDictionary_lib());



app.use('/', authenticatedRoutes);

module.exports = app;
