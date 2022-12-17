"use strict";

const mongoSingle = require("@core/mongo-single");
const configGet = require("@core/config-get");
const { createClient } = require("xen-api");

module.exports = async (uuid, newName) => {
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

    const vms = await mongoSingle.get("vms");

    if (!vms) {
        throw new Error(`vm-rename: no VMs found in database`);
    }

    // get the vm details from the db (we need it for the ref too...)
    const vm = vms.find((item) => item.uuid === uuid);
    if (!vm) {
        throw new Error(`vm-rename: could not find VM with uuid ${uuid}`);
    }

    // let's overwrite the name field - it'll be replaced once the worker detects the real state
    vm.name_label = newName;

    // saving to db
    mongoSingle.set("vms", vms, 30);

    await xapi.connect();
    console.log(`vm-rename: renaming vm uuid ${uuid} to '${newName}'`);
    await xapi.call("VM.set_name_label", vm.ref, newName);
    return true;
};
