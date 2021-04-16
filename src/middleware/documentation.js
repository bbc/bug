//NAME: documentation.js
//AUTH: Ryan McCartney <ryan.mccartney@bbc.co.uk>
//DATE: 13/04/2021
//DESC: BUG API Docs service defined here

const express = require('express');
const documentation = express.Router();

const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require("swagger-jsdoc");

const host = process.env.BUG_CORE_HOST || 'localhost';
const port = process.env.BUG_CORE_PORT || '3101';
const url = `${host}:${port}/api/`

const customCSS = {
  customCss: '.swagger-ui .topbar { display: none }'
};

const swagerOptions = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "BUG Core API",
        version: "0.1.0",
        description: "This is a simple CRUD API application made with Express and documented with Swagger",
        license: {
          name: "MIT",
          url: "https://spdx.org/licenses/MIT.html"
        },
        contact: {
          name: "Ryan McCartney",
          url: "https://bbc.co.uk",
          email: "ryan.mccartney@bbc.co.uk"
        }
      },
      servers: [
        {
          url: url
        }
      ]
    },
    apis: ["./routes/*.js"]
}

const swaggerDocs = swaggerJSDoc(swagerOptions);
documentation.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocs,customCSS));

module.exports = documentation;