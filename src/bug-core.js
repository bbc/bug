//NAME: bug.js
//AUTH: 
//DATE: 04/02/2021
//DESC: Main Bug Core Service Defined Here

const express = require('express');
const createError = require('http-errors');

const path = require('path');
const cors = require('cors');
const helmet = require('helmet');

const logger = require('morgan');
fs = require('fs');

// Define the Express apilication
var bug = express();
var port = process.env.BUG_CORE_PORT || 3005;

bug.set('json spaces', 2);
bug.use(cors());
bug.use(helmet());

// Setup logging
bug.use(logger('dev'));
bug.use(logger('common', {
  stream: fs.createWriteStream(path.join(__dirname, 'logs', 'access.log'), {flags: 'a'})
}));

//Require and configure body parser to handle post requests
const bodyParser = require("body-parser");
bug.use(bodyParser.urlencoded({ extended: true }));
bug.use(bodyParser.json());

var Docker = require('dockerode');
var docker = new Docker({socketPath: '/var/run/docker.sock'});

function getDirectories(path) {
  return fs.readdirSync(path).filter(function (file) {
    return fs.statSync(path+'/'+file).isDirectory();
  });
}

bug.get('/', (req, res) => {
  res.send('BUG Hello World 12')
})

bug.get('/api/containers', (req, res) => {
  docker.listContainers({all: true}, function(err, containers) {
    res.send(containers);
    });
})

bug.get('/api/modules', (req, res) => {
    res.send(getDirectories('./modules'));
})


bug.listen(port, () => {
    console.log('INFO: Listening on port '+port.toString());
});