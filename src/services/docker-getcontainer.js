"use strict";

const docker = require("@utils/docker");

module.exports = async (panelId) => {
    return new Promise((resolve, reject) => {
        try {
            const container = docker.getContainer(panelId);
            container.stats({ stream: false }, function (err, stream) {
                if (err) {
                    resolve(null);
                }
                resolve(container);
            });
        } catch (error) {
            // this isn't really an error - we just didn't find it
            resolve(null);
        }
    });
};
