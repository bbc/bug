'use strict';

const mongoCollection = require('@core/mongo-collection');
const wildcard = require('wildcard-regex');
const configGet = require("@core/config-get");
const sortHandlers = require("@core/sort-handlers");

module.exports = async (sortField = null, sortDirection = "asc", filters = {}) => {

    const config = await configGet();
    if (!config) {
        return null;
    }

    const dbInterfaces = await mongoCollection('interfaces');
    let interfaces = await dbInterfaces.find().toArray();
    if (!interfaces) {
        return null;
    }

    const dbLinkStats = await mongoCollection('linkstats');
    let linkStats = await dbLinkStats.find().toArray();
    const linkStatsByName = {};
    for (let eachLinksStat of linkStats) {
        linkStatsByName[eachLinksStat['name']] = eachLinksStat;
    }

    const dbTraffic = await mongoCollection('traffic');
    let traffic = await dbTraffic.find().toArray();
    const trafficByName = {};
    for (let eachInterface of traffic) {
        trafficByName[eachInterface['name']] = eachInterface;
    }

    // remove excluded interfaces
    if (config.excludedInterfaces) {
        for (let eachFilter of config.excludedInterfaces) {
            const regex = wildcard.wildcardRegExp(eachFilter);

            interfaces = interfaces.filter(
                iface => {
                    return !regex.test(iface['name']);
                }
            );
        }
    }

    const matchAnyRegex = (regexes, value) => {
        for (let eachRegex of regexes) {
            if (eachRegex.test(value)) {
                return true;
            }
        }
        return false;
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
        eachInterface['_protected'] = matchAnyRegex(protectedRegexArray, eachInterface.name);

        // this boolean helps the UI know whether the interface can be directly removed from the protected interfaces
        // if it's false, then the protection is provided by a wildcard
        eachInterface['_allowunprotect'] = (config.protectedInterfaces.find((loopInterface, index) => {
            return (loopInterface == eachInterface.name);
        }) !== undefined);

    }

    const sortHandlerList = {
        name: sortHandlers.string,
        ['mac-address']: sortHandlers.boolean,
    }

    // sort
    if (sortField && sortHandlerList[sortField]) {
        if (sortDirection === "asc") {
            interfaces.sort((a, b) => sortHandlerList[sortField](a, b, sortField));
        }
        else {
            interfaces.sort((a, b) => sortHandlerList[sortField](b, a, sortField));
        }
    }

    for (let eachInterface of interfaces) {
        // add link stats
        if (eachInterface['name'] in linkStatsByName) {
            eachInterface['linkstats'] = linkStatsByName[eachInterface['name']];
        }
        else {
            eachInterface['linkstats'] = [];
        }

        // add traffic
        if (eachInterface['name'] in trafficByName) {
            eachInterface['traffic'] = trafficByName[eachInterface['name']];
        }
        else {
            eachInterface['traffic'] = [];
        }

    }
    return interfaces;
}

