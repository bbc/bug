//NAME: sputnik.js
//AUTH: Ryan McCartney <ryan.mccartney@bbc.co.uk>
//DATE: 18/04/2021
//DESC: Sputnik endpoint

const express = require("express");
const sputnik = express.Router();

const hashResponse = require("@core/hash-response");
const getSputniks = require("@services/sputniks-get");
const getSputnik = require("@services/sputnik-get");

sputnik.get("/all", async function (req, res) {
    hashResponse(res, req, await getSputniks());
});

sputnik.get("/:identifier", async function (req, res) {
    hashResponse(res, req, await getSputnik(req?.params?.identifier));
});

module.exports = sputnik;
