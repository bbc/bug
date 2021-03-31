//NAME: status.js
//AUTH: Ryan McCartney <ryan.mccartney@bbc.co.uk>
//DATE: 15/02/2021
//DESC: System status

const express = require('express');
const status = express.Router();

status.get('/', function(req, res){
  var completeURL = req.protocol + '://' + req.get('host') + req.originalUrl;
  let status = {
    request_url: completeURL,
    request_method: req.method,
    request_params: req.query,
    note: "Test Response"
  }

  res.header("Content-Type",'application/json');
  res.json(status);
  })

module.exports = status;
