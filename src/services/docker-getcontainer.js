'use strict';

const docker = require('@utils/docker');

module.exports = async (panelId) => {
    return new Promise((resolve, reject) => {
        try {
            var container = docker.getContainer(panelId);
            container.stats({ stream: false }, function (err, stream) {
                if (err) {
                    resolve(null);
                }
                resolve(container);
            })

        } catch (error) {
            resolve(null);
        }
    });
}