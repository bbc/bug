//NAME: status.js
//AUTH: Geoff House <geoff.house@bbc.co.uk>
//DATE: 23/03/2021
//DESC: System status

var express = require('express'),
status = express.Router();

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