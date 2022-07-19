"use strict";

const mongoSingle = require("@core/mongo-single");
const configGet = require("@core/config-get");
const { createClient } = require("xen-api");

module.exports = async (uuid, newDescription) => {
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
        throw new Error(`vm-setdescription: no VMs found in database`);
    }

    // get the vm details from the db (we need it for the ref too...)
    const vm = vms.find((item) => item.uuid === uuid);
    if (!vm) {
        throw new Error(`vm-setdescription: could not find VM with uuid ${uuid}`);
    }

    // let's overwrite the description field - it'll be replaced once the worker detects the real state
    vm.name_description = newDescription;

    // saving to db
    mongoSingle.set("vms", vms, 30);

    await xapi.connect();
    console.log(`vm-setdescription: updating description on vm uuid ${uuid} to '${newDescription}'`);
    await xapi.call("VM.set_name_description", vm.ref, newDescription);
    return true;
};
