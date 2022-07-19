"use strict";

const mongoSingle = require("@core/mongo-single");
const configGet = require("@core/config-get");
const { createClient } = require("xen-api");

module.exports = async (uuid) => {
    const config = await configGet();
    if (!config) {
        throw new Error();
    }

    const xapi = await createClient({
        url: `https://${config.address}`,
        allowUnauthorized: true,
        auth: {
            user: config.username,
            password: config.password,
        },
        readOnly: false,
    });

    // check that VM can be stopped
    const vms = await mongoSingle.get("vms");

    if (!vms) {
        throw new Error(`vm-enableautopower: no VMs found in database`);
    }

    // get the vm details from the db (we need it for the ref too...)
    const vm = vms.find((item) => item.uuid === uuid);
    if (!vm) {
        throw new Error(`vm-enableautopower: could not find VM with uuid ${uuid}`);
    }

    // let's overwrite the db field - it'll be replaced once the worker detects the real state
    vm.other_config.auto_poweron = "true";

    // saving to db
    mongoSingle.set("vms", vms, 30);

    await xapi.connect();
    console.log(`vm-enableautopower: rebooting vm uuid ${uuid}`);
    await xapi.call("VM.set_other_config", vm.ref, { auto_poweron: "true" });
    return true;
};
