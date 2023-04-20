"use strict";

const { request, gql } = require("graphql-request");

const ddmRequest = async (address, port = 80, apiKey, query = {}, variables = {}) => {
    const endpoint = `http://${address}:${port}/graphql`;

    const data = await request(endpoint, query, variables, {
        Authorization: apiKey,
    });

    return data;
};

module.exports = { query: gql, get: ddmRequest };
