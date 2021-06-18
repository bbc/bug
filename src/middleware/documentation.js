const express = require("express");
const documentation = express.Router();

const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");

const host = process.env.BUG_CORE_HOST || "localhost";
const port = process.env.BUG_CORE_PORT || "3101";
const url = `${host}:${port}/api/`;

const options = {
    customCssUrl: "/css/documentation.css",
};

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "BUG Core API",
            version: "0.1.0",
            description: "This is a simple CRUD API application made with Express and documented with Swagger",
            license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html",
            },
            contact: {
                name: "Bug Developers",
                url: "https://bbc.co.uk",
                email: "bug.developers@bbc.co.uk",
            },
        },
        servers: [
            {
                url: url,
            },
        ],
    },
    apis: ["./routes/*.js", "./modules/*.js"],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
documentation.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocs, options));

module.exports = documentation;
