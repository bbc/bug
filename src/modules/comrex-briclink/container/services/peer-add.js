"use strict";

const comrexSocket = require("@utils/comrex-socket");
const configGet = require("@core/config-get");

module.exports = async (formData) => {
    const config = await configGet();
    if (!config) {
        throw new Error();
    }

    let addString = "<";
    addString += `addPeer `;
    addString += `name="${formData.name}" `;
    addString += `addr="${formData.addr}" `;
    addString += `profile="${formData.profile}" `;
    addString += "/>";

    try {
        const device = new comrexSocket({
            host: config.address,
            port: config.port,
            username: config.username,
            password: config.password,
        });
        await device.connect();
        console.log(`peer-add: sending '${addString}'`);
        device.send(addString);
        setTimeout(() => {
            device.disconnect();
        }, 1000);

        return true;
    } catch (error) {
        return false;
    }
};
