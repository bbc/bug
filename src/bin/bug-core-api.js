
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const register = require('module-alias/register')
const bodyParser = require('body-parser')
const cors = require('cors');
const favicon = require('serve-favicon');
const helmet = require('helmet');

// import environment variables from .env file
require('dotenv').config();

// load routes
const systemRouter = require('@routes/system');
const moduleRouter = require('@routes/module');
const panelRouter = require('@routes/panel');
const bugRouter = require('@routes/bug');
const proxyRouter = require('@routes/proxy');

var bugApi = express();

bugApi.set('json spaces', 2);
bugApi.use(cors());
bugApi.use(helmet());
bugApi.use(favicon(path.join(__dirname,'..','client','public','favicon.ico')));

bugApi.use(express.json());
bugApi.use(express.urlencoded({ extended: false }));
bugApi.use(cookieParser());
bugApi.use(bodyParser.json())
bugApi.use(express.static(path.join(__dirname, 'public')));

bugApi.use('/api/bug', bugRouter);
bugApi.use('/api/system', systemRouter);
bugApi.use('/api/module', moduleRouter);
bugApi.use('/api/panel', panelRouter);
bugApi.use('/api/proxy', proxyRouter);

// catch 404 and forward to error handler
// bugApi.use(function (req, res, next) {
//     const err = new Error('File Not Found');
//     err.status = 404;
//     next(err);
// });

// error handler
bugApi.use(function (err, req, res, next) {
    res.status(err.status || 500).json({
        errorcode: err.status,
        error: err.message
    });
});

module.exports = bugApi;
