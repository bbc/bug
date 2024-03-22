"use strict";

const prodigyPromise = require("@utils/prodigy-promise");
const delay = require("delay");

module.exports = (address, port) => {
    return new Promise(async (resolve, reject) => {
        const prodigy = new prodigyPromise({
            host: address,
            port: port,
        });

        prodigy.on("update", async (result) => {
            resolve(true);
        });

        await prodigy.connect();

        prodigy.send(JSON.stringify({ type: "get", obj: ["fan", "power"] }));

        await delay(2000);
        resolve(false);
    });
};
