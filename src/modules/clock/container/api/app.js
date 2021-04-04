//NAME: app.js
//AUTH: Ryan McCartney <ryan.mccartney@bbc.co.uk>
//DATE: 19/03/2021
//DESC: Blackmagic Design VideoHub Module

const createError = require('http-errors');
const express = require('express');

// Define the Express application
let app = express();
app.set('json spaces', 2);

//Define routes
const routes = require('./routes');
app.use('/api',routes);

app.use(function(req, res, next){
    next(createError(404));
});

module.exports = app;