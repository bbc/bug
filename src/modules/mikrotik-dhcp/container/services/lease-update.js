"use strict";

const mongoCollection = require("@core/mongo-collection");
const leaseSet = require("./mikrotik-leaseset");
const leaseEnable = require("./mikrotik-leaseenable");
const leaseDisable = require("./mikrotik-leasedisable");
const mikrotikLeaseMakeStatic = require("./mikrotik-leasemakestatic");

module.exports = async (leaseId, formData) => {

    // get the previous values to compare
    const dbLeases = await mongoCollection("leases");
    let lease = await dbLeases.findOne({ "id": leaseId });

    if (!lease) {
        return false;
    }

    // if lease isn't static, make it static first ...
    if (lease.dynamic) {
        if (!await mikrotikLeaseMakeStatic(leaseId)) {
            return false;
        }
    }

    if (formData.address && formData.address !== lease.address) {
        if (!await leaseSet(leaseId, "address", formData.address)) {
            return false;
        }
    }

    if (formData.comment !== lease.comment) {
        if (!await leaseSet(leaseId, "comment", formData.comment ? formData.comment : "")) {
            return false;
        }
    }

    if (formData['mac-address'] && formData['mac-address'] !== lease['mac-address']) {
        if (!await leaseSet(leaseId, "mac-address", formData['mac-address'])) {
            return false;
        }
    }

    if (formData.enabled !== lease.enabled) {
        if (formData.enabled) {
            if (!await leaseEnable(leaseId)) {
                return false;
            }
        }
        else {
            if (!await leaseDisable(leaseId)) {
                return false;
            }
        }
    }

    if (formData['server'] && formData['server'] !== lease['server']) {
        if (!await leaseSet(leaseId, "server", formData['server'])) {
            return false;
        }
    }

    if (formData['address-lists'] !== undefined) {
        const formDataAddressListString = formData['address-lists'].join(",");
        if (formDataAddressListString !== lease['address-lists']) {
            if (!await leaseSet(leaseId, "address-lists", formDataAddressListString)) {
                return false;
            }
        }
    }

    return true;
};
