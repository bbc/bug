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
const documentation = require('@middleware/documentation');
const systemRouter = require('@routes/system');
const moduleRouter = require('@routes/module');
const panelRouter = require('@routes/panel');
const bugRouter = require('@routes/bug');
const proxyRouter = require('@routes/proxy');

const bugApi = express();

bugApi.set('json spaces', 2);
bugApi.use(cors());
bugApi.use(helmet.contentSecurityPolicy({
    reportOnly:true,
    directives:{
      'default-src': [ "'self'" ],
      'base-uri': [ "'self'" ],
      'block-all-mixed-content': [],
      'font-src': [ "'self'", 'https:', 'http:', 'data:' ],
      'frame-ancestors': [ "'self'" ],
      'img-src': [ "'self'", 'data:' ],
      'object-src': [ "'none'" ],
      'script-src': [ "'self'" ],
      'script-src-attr': [ "'none'" ],
      'style-src': [ "'self'", 'https:', 'http:', "'unsafe-inline'" ],
      'upgrade-insecure-requests': []
    }
}));

bugApi.use(favicon(path.join(__dirname,'..','client','public','favicon.ico')));

bugApi.use(express.json());
bugApi.use(express.urlencoded({ extended: false }));
bugApi.use(cookieParser());
bugApi.use(bodyParser.json())
bugApi.use(express.static(path.join(__dirname, 'public')));

bugApi.use('/documentation',documentation)
bugApi.use('/container', proxyRouter);
bugApi.use('/api/bug', bugRouter);
bugApi.use('/api/system', systemRouter);
bugApi.use('/api/module', moduleRouter);
bugApi.use('/api/panel', panelRouter);

//Serve files in the public folder
bugApi.use(express.static(path.join(__dirname, '..','client', 'public')));

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
