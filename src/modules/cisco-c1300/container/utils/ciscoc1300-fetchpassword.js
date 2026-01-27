"use strict";

const delay = require("delay");
const register = require("module-alias/register");
const ciscoC1300SSH = require("@utils/ciscoc1300-ssh");
const mongoSingle = require("@core/mongo-single");

module.exports = async function (config, _) {

    // Kick things off
    console.log(`ciscoc1300-fetchpassword: connecting to device at ${config?.address} via ssh`);

    try {
        await ciscoC1300SSH({
            host: config.address,
            username: config.username,
            password: config.password,
            timeout: 20000,
            commands: ["exit"],
        });
        await mongoSingle.set("passwordexpired", false, 600);
    } catch (error) {
        if (error && error.indexOf("exceeded the maximum lifetime") > -1) {
            console.log(`ciscoc1300-fetchpassword: password has expired!!`);
            await mongoSingle.set("passwordexpired", true, 600);
        }
        else {
            console.log(`ERROR: ${error}`);
        }
    }

    // await delay(60000);
};

