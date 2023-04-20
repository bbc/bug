"use strict";

const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");

module.exports = async () => {
    let config;
    try {
        config = await configGet();
        if (!config) {
            throw new Error();
        }
    } catch (error) {
        console.log(`ddm-getlabels: failed to fetch config`);
        return false;
    }

    const domainsCollection = await mongoCollection("domains");
    const domainsArray = [];
    const domains = await domainsCollection.find().toArray();

    for (let domain of domains) {
        domainsArray.push(domain.name);
    }

    return domainsArray;
};
