//NAME: status.js
//AUTH: Ryan McCartney <ryan.mccartney@bbc.co.uk>
//DATE: 18/04/2021
//DESC: System status

const mduStatus = require('@services/mdu-status');
const express = require('express'),
status = express.Router();

status.get('/', function(req, res){
  const completeURL = req.protocol + '://' + req.get('host') + req.originalUrl;
  let response = {
    status: {
    request_url: completeURL,
    request_method: req.method,
    request_params: req.query
    }
  }

  response.mdu = mduStatus();

  res.header("Content-Type",'application/json');
  res.json(response);

})

module.exports = status;