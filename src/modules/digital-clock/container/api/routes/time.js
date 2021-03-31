//NAME: time.js
//AUTH: Ryan McCartney <ryan.mccartney@bbc.co.uk>
//DATE: 15/02/2021
//DESC: System status

const express = require('express');
const time = express.Router();

time.get('/', function(req, res){
  var completeURL = req.protocol + '://' + req.get('host') + req.originalUrl;
  let status = {
    request_url: completeURL,
    request_method: req.method,
    request_params: req.query,
  }

  status.time = Date.now()

  res.header("Content-Type",'application/json');
  res.json(status);
  })

module.exports = time;
