const express = require("express");
const router = express.Router();
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");

const host = process.env.BUG_HOST || "localhost";
const port = process.env.BUG_PORT || "3101";
const url = `http://${host}:${port}/api/`;

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
                name: "Apache-2.0",
                url: "https://www.gnu.org/licenses/gpl-3.0.en.html",
            },
            contact: {
                name: "Bug Developers",
                url: "https://github.com/bbc/bug",
            },
        },
        servers: [
            {
                url: url,
            },
        ],
    },
    apis: [
        path.join(__dirname, "../routes/*.js"),
        path.join(__dirname, "../../modules/*.js")
    ],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
router.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocs, options));

module.exports = router;
