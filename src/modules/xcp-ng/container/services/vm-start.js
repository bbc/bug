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

    // check that VM can be started
    const vms = await mongoSingle.get("vms");

    if (!vms) {
        throw new Error(`vm-start: no VMs found in database`);
    }

    // get the vm details from the db (we need it for the ref too...)
    const vm = vms.find((item) => item.uuid === uuid);
    if (!vm) {
        throw new Error(`vm-start: could not find VM with uuid ${uuid}`);
    }

    if (!vm.allowed_operations.includes("start")) {
        throw new Error(`vm-start: VM ${uuid} is not allowed to start`);
    }

    // let's overwrite the status field to say 'starting' - it'll be replaced once the worker detects the real state
    vm.current_operations["bug_synthetic_operation"] = "start";

    // saving to db
    mongoSingle.set("vms", vms, 30);

    await xapi.connect();
    console.log(`vm-start: starting vm uuid ${uuid}`);
    await xapi.call("VM.start", vm.ref, false, false);
    return true;
};
