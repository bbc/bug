"use strict";

const mongoCollection = require("@core/mongo-collection");
const matchAnyRegex = require("@core/regex-matchany");
const wildcard = require("wildcard-regex");
const configGet = require("@core/config-get");

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

    if (stackId !== null) {
        interfaces = interfaces.filter((iface) => iface["device"] === parseInt(stackId));
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
            config.protectedInterfaces.find((loopInterface, index) => {
                return loopInterface == eachInterface.longId;
            }) !== undefined;
    }

    return interfaces;
};
