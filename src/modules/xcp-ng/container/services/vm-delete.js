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

    // check that VM can be deleted
    const vms = await mongoSingle.get("vms");

    if (!vms) {
        throw new Error(`vm-delete: no VMs found in database`);
    }

    // get the vm details from the db (we need it for the ref too...)
    const vm = vms.find((item) => item.uuid === uuid);
    if (!vm) {
        throw new Error(`vm-delete: could not find VM with uuid ${uuid}`);
    }

    if (!vm.allowed_operations.includes("start")) {
        throw new Error(`vm-delete: VM ${uuid} is not allowed to be destroyed`);
    }

    // let's overwrite the status field to say 'destroying' - it'll be replaced once the worker detects the real state
    vm.current_operations["bug_synthetic_operation"] = "destroy";

    // saving to db
    mongoSingle.set("vms", vms, 30);

    await xapi.connect();
    console.log(`vm-delete: deleting vm uuid ${uuid}`);
    await xapi.call("VM.destroy", vm.ref);
    return true;
};
