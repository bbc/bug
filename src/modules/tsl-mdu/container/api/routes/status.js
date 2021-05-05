//NAME: status.js
//AUTH: Ryan McCartney <ryan.mccartney@bbc.co.uk>
//DATE: 18/04/2021
//DESC: System status

const mduStatus = require('@services/mdu-status');
const express = require('express'),
status = express.Router();

status.get('/', async function(req, res){
  
  let response = {
    request_url: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
    request_method: req.method,
    request_params: req.query
  }

  response.mdu = await mduStatus();

  res.header("Content-Type",'application/json');
  res.json(response);

})

module.exports = status;