"use strict";

const { promises: fs } = require("fs");
const path = require("path");
const nodeEnv = process.env.NODE_ENV || "production";
const logger = require("@utils/logger")(module);

module.exports = async (filepath, moduleName) => {
    const filename = path.join(filepath, "Dockerfile");

    try {
        const moduleHome = process.env.MODULE_HOME || "/home/node/module";

        // define relative paths from project root to use in COPY commands
        const relModulePath = `src/modules/${moduleName}/container`;
        const relCorePath = `src/server/core`;

        const fileArray = [
            "FROM node:22-alpine",
            `WORKDIR ${moduleHome}`,
            "RUN apk add --no-cache iputils",

            // copy the shared core folder first
            `COPY ${relCorePath} ./core`,

            // copy the module-specific files
            `COPY ${relModulePath} ./`,

            // install and run
            `RUN npm install`,
            `CMD ["npm", "run", "${nodeEnv}"]`,
        ];

        const newFile = fileArray.join("\n");

        // check if file exists and if it's different to prevent unnecessary writes
        let existingFile = null;
        try {
            existingFile = await fs.readFile(filename, "utf8");
        } catch (error) {
            // file doesn't exist, which is fine
        }

        if (existingFile !== newFile) {
            logger.info(`dockerfile-write: writing updated Dockerfile for ${moduleName} at ${filename}`);
            await fs.writeFile(filename, newFile);
        }

        return true;
    } catch (error) {
        logger.error(`dockerfile-write: ${error.stack}`);
        throw new Error(`Failed to write Dockerfile for ${moduleName}`);
    }
};