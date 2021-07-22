"use strict";

const tar = require("tar");
const fs = require("fs");

module.exports = async (tarballPath, extractToPath) => {
    try {
        const status = await fs.createReadStream(tarballPath).pipe(
            tar.x({
                strip: 1,
                C: extractToPath,
            })
        );
        return status;
    } catch (error) {
        logger.warning(`${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed to extract the tarball`);
    }
};
