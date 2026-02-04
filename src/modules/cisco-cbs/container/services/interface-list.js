"use strict";

const mongoCollection = require("@core/mongo-collection");
const matchAnyRegex = require("@core/regex-matchany");
const wildcard = require("wildcard-regex");
const configGet = require("@core/config-get");
const ciscoCBSExpandVlanRanges = require("@utils/ciscocbs-expandvlanranges");
const mongoSingle = require("@core/mongo-single");

module.exports = async (sortField = null, sortDirection = "asc", filters = {}, stackId = null) => {
    try {
        const config = await configGet();
        if (!config) {
            throw new Error("failed to load config");
        }

        const dbInterfaces = await mongoCollection("interfaces");
        let interfaces = await dbInterfaces.find().toArray();
        if (!interfaces) {
            throw new Error("invalid input");
        }

        interfaces = [...interfaces];

        if (stackId !== null) {
            interfaces = interfaces.filter((iface) => iface["device"] === parseInt(stackId));
        }

        // cache the regexes - once
        let protectedRegexArray = [];
        if (config.protectedInterfaces) {
            protectedRegexArray = [...config.protectedInterfaces].map((eachFilter) =>
                wildcard.wildcardRegExp(eachFilter)
            );
        }

        // loop through and set protected interface for each
        for (let eachInterface of interfaces) {
            eachInterface["_protected"] = matchAnyRegex(protectedRegexArray, [
                eachInterface.description,
                eachInterface.shortId,
                eachInterface.longId,
            ]);

            // this boolean helps the UI know whether the interface can be directly removed from the protected interfaces
            // if it's false, then the protection is provided by a wildcard
            eachInterface["_allowunprotect"] =
                config.protectedInterfaces &&
                config.protectedInterfaces.find((loopInterface, index) => {
                    return loopInterface == eachInterface.longId;
                }) !== undefined;
        }

        const vlans = await mongoSingle.get("vlans");
        const availableVlanArray = vlans && [...vlans].map((eachVlan) => eachVlan.id);

        if (vlans) {
            // expand any '1-4094' entries
            for (let eachInterface of interfaces) {
                const taggedVlans = Array.isArray(eachInterface["tagged-vlans"])
                    ? [...eachInterface["tagged-vlans"]]
                    : eachInterface["tagged-vlans"];
                eachInterface["tagged-vlans"] = ciscoCBSExpandVlanRanges(taggedVlans, availableVlanArray);
            }
        }

        return interfaces;
    } catch (err) {
        err.message = `interfaces-service: ${err.stack || err.message || err}`;
        throw err;
    }
};
