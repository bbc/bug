const express = require('express');
const createError = require('http-errors');
const register = require('module-alias/register')
const bodyParser = require('body-parser')

// load routes
const statusRouter = require('./routes/status');
const configRouter = require('./routes/config');
const defaultRouter = require('./routes/default');

let app = express();

app.set('json spaces', 2);
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/status', statusRouter);
app.use('/api/config', configRouter);
app.use('*', defaultRouter);

module.exports = app;