#!/usr/bin/env node

const register = require('module-alias/register')
const express = require('express');
const path = require('path');
const logger = require('@utils/logger');

// import the API logic
const bugApi = require('@bin/api');

// get the port from the .env file
const port = process.env.BUG_CORE_PORT || '3100';

// include react static client files
bugApi.use(express.static(path.join(__dirname, '..','client', 'build')));

// serve React bugApilication 
bugApi.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

// and start it up
bugApi.listen(port, () => logger.info(`Listening on port ${port}`));