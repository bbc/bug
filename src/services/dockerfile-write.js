"use strict";

const { promises: fs } = require("fs");
const path = require("path");
const nodeEnv = process.env.NODE_ENV || "production";
const logger = require("@utils/logger")(module);

module.exports = async (filepath) => {
    try {
        const moduleHome = process.env.MODULE_HOME || "/home/node/module";

        const filename = path.join(filepath, "Dockerfile");
        const fileArray = [
            "FROM node:16.19-alpine",
            `WORKDIR ${moduleHome}`,
            `COPY . .`,
            `RUN apk add iputils`, //Added due to issue - https://github.com/danielzzz/node-ping/issues/89
            `RUN npm install`,
            `CMD ["npm","run","${nodeEnv}"]`,
        ];

        const newFile = fileArray.join("\n");

        // check if any difference
        let existingFile = null;
        try {
            existingFile = await fs.readfile(filename);
        } catch (error) {}

        if (existingFile != newFile) {
            logger.info(`writing dockerfile ${filename}`);
            await fs.writeFile(filename, newFile);
        }
    } catch (error) {
        logger.error(`${error?.stack || error?.trace || error || error?.message}`);
        throw new Error(`Failed to write dockerfile ${filename}`);
    }
    return true;
};
