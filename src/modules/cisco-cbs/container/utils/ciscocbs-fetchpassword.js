"use strict";

const delay = require("delay");
const register = require("module-alias/register");
const ciscoCbsSSH = require("@utils/ciscocbs-ssh");
const mongoSingle = require("@core/mongo-single");

module.exports = async function (config, _) {

    // Kick things off
    console.log(`ciscocbs-fetchpassword: connecting to device at ${config?.address} via ssh`);

    try {
        await ciscoCbsSSH({
            host: config.address,
            username: config.username,
            password: config.password,
            timeout: 20000,
            commands: ["exit"],
        });
        await mongoSingle.set("passwordexpired", false, 1200000);
    } catch (error) {
        if (error && error.includes("exceeded the maximum lifetime")) {
            console.log(`ciscocbs-fetchpassword: password has expired!!`);
            await mongoSingle.set("passwordexpired", true, 1200000);
        }
        else {
            console.log(`ERROR: ${error}`);
        }
    }

};

