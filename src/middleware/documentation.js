const express = require("express");
const documentation = express.Router();

const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");

const host = process.env.BUG_HOST || "localhost";
const port = process.env.BUG_PORT || "3101";
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
                name: "GPLv3",
                url: "https://www.gnu.org/licenses/gpl-3.0.en.html",
            },
            contact: {
                name: "Bug Developers",
                url: "https://bug.pages.github.io",
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
