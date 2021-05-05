//NAME: output.js
//AUTH: Ryan McCartney <ryan.mccartney@bbc.co.uk>
//DATE: 18/04/2021
//DESC: System status

const express = require('express');
const output = express.Router();

const getOutputs = require('@services/outputs-get');
const getOutput = require('@services/output-get');
const setOutput = require('@services/output-set');

output.get('/all', function(req, res){

  let response = {
    request_url: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
    request_method: req.method,
    request_params: req.query
  }

  response.output = getOutputs();

  res.header("Content-Type",'application/json');
  res.json(response);
})

output.get('/:output_number', function(req, res){

  let response = {
    request_url: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
    request_method: req.method,
    request_params: req.query
  }

  response.output = getOutput(req?.params?.output_number);

  res.header("Content-Type",'application/json');
  res.json(response);
})

output.post('/:output_number', function(req, res){

  let response = {
    request_url: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
    request_method: req.method,
    request_params: req.query
  }

  response.output = setOutput(req?.params?.output_number);

  res.header("Content-Type",'application/json');
  res.json(response);
})

module.exports = output;