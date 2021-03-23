#!/usr/bin/env node

const express = require('express');
const path = require('path');

// import the API logic
const bugApi = require('./bug-core-api');

// get the port from the .env file
var port = process.env.PORT_PROD || '3100';

// include react static client files
bugApi.use(express.static(path.join(__dirname, '..','client', 'build')));

// serve React bugApilication 
bugApi.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

// and start it up
bugApi.listen(port, () => console.log(`Listening on port ${port}`));