"use strict";

const mongoCollection = require("@core/mongo-collection");
const matchAnyRegex = require("@core/regex-matchany");
const wildcard = require("wildcard-regex");
const configGet = require("@core/config-get");
const mongoSingle = require("@core/mongo-single");

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

    // optionally - add VLAN helper fields

    // custom sort by short ID - which is something like 'eth1' or 'eth11'
    return interfaces.sort((a, b) => (a.port > b.port ? 1 : -1));
};
