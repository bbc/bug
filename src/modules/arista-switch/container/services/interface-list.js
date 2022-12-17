"use strict";

const mongoCollection = require("@core/mongo-collection");
const matchAnyRegex = require("@core/regex-matchany");
const wildcard = require("wildcard-regex");
const configGet = require("@core/config-get");
const mongoSingle = require("@core/mongo-single");
const aristaExpandVlanRanges = require("@utils/arista-expandvlanranges");

module.exports = async (sortField = null, sortDirection = "asc", filters = {}, stackId = null) => {
    const config = await configGet();
    if (!config) {
        return null;
    }
    const dbInterfaces = await mongoCollection("interfaces");
    let interfaces = await dbInterfaces.find().toArray();
    if (!interfaces) {
        return [];
    }

    // cache the regexes - once
    let protectedRegexArray = [];
    if (config.protectedInterfaces) {
        for (let eachFilter of config.protectedInterfaces) {
            protectedRegexArray.push(wildcard.wildcardRegExp(eachFilter));
        }
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
    const availableVlanArray = vlans && vlans.map((eachVlan) => eachVlan.id);

    if (vlans) {
        // loop through and add helper functions for vlans
        for (let eachInterface of interfaces) {
            if (eachInterface.mode === "access") {
                eachInterface["_taggedVlans"] = [];
                eachInterface["_untaggedVlan"] = eachInterface.accessVlanId;
            } else if (eachInterface.mode === "trunk") {
                const vlanArray = aristaExpandVlanRanges(eachInterface.trunkAllowedVlans, availableVlanArray);
                eachInterface["_taggedVlans"] = vlanArray;
                eachInterface["_untaggedVlan"] = eachInterface.trunkingNativeVlanId;
            } else {
                eachInterface["_taggedVlans"] = [];
                eachInterface["_untaggedVlan"] = 1;
            }
            delete eachInterface.mode;
            delete eachInterface.accessVlanId;
            delete eachInterface.trunkAllowedVlans;
            delete eachInterface.trunkingNativeVlanId;
        }
    }

    // custom sort by short ID - which is something like 'eth1' or 'eth11'
    return interfaces.sort((a, b) => (a.port > b.port ? 1 : -1));
};
