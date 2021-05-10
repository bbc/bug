//NAME: app.js
//AUTH: Geoff House <geoff.house@bbc.co.uk>
//DATE: 23/03/2021
//DESC: Mikrotik Interfaces module

const createError = require('http-errors');
const express = require('express');
const mdu = require('@utils/mdu');

// Define the Express application
let app = express();
app.set('json spaces', 2);

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

//Define routes
const routes = require('./routes');
app.use('/api', routes);

app.use(function (req, res, next) {
    next(createError(404));
});

module.exports = app;