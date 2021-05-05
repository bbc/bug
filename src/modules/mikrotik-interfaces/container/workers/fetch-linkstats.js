const RosApi = require('node-routeros').RouterOSAPI;
const delay = require('delay');
const mongoCollection = require('../utils/mongo-collection');
const mikrotikFetchLinkStats = require('../services/mikrotik-fetchlinkstats');
const arraySave = require('../services/array-save');
const interfaceList = require('../services/interface-list');
const mongoDb = require('../utils/mongo-db');
const configGet = require("../services/config-get");
const delayMs = 5000;
const errorDelayMs = 10000;
let linkStatsCollection;
let config;

process.on('uncaughtException', function(err) {
    console.log("fetch-linkstats: device poller failed ... restarting");
    main();
});

const pollDevice = async () => {

    const conn = new RosApi({
        host: config.address,
        user: config.username,
        password: config.password,
        timeout: 5
    });

    console.log('fetch-linkstats: starting ...');

    // initial delay (to stagger device polls)
    await delay(1000);

    try {
        console.log("fetch-linkstats: connecting to device " + JSON.stringify(conn));
        await conn.connect();
    } catch (error) {
        console.log("fetch-linkstats: failed to connect to device");
        return;
    }
    console.log("fetch-linkstats: device connected ok");

    var noErrors = true;
    console.log('fetch-linkstats: starting device poll....');
    while (noErrors) {
        try {
            // fetch interface list from db (empty if not yet fetched)
            const interfaces = await interfaceList();

            // fetch link stats for each interface
            let linkStatsArray = [];
            if (interfaces) {
                for (eachInterface of interfaces) {
                    if (eachInterface['type'] === 'ether') {
                        linkStatsArray.push(await mikrotikFetchLinkStats(conn, eachInterface['name']));
                    }
                }
            }
            await arraySave(linkStatsCollection, linkStatsArray, 'name');
        } catch (error) {
            console.log('fetch-linkstats: ', error);
            noErrors = true;
        }
        await delay(delayMs);
    }
    await conn.close();
}

const main = async () => {

    try {
        config = await configGet();
        if(!config) {
            throw new Error();
        }
        console.log("fetch-linkstats: got config OK");
    } catch (error) {
        console.log(`fetch-linkstats: failed to fetch config`);
        return;
    }

    try {
        console.log(`fetch-linkstats: connecting to database`);
        await mongoDb.connect(config.id);

    } catch (error) {
        console.log("fetch-linkstats: error connecting to database");
        return;
    }

    linkStatsCollection = await mongoCollection('linkstats');

    if (!linkStatsCollection) {
        console.log("fetch-linkstats: error fetching database collection");
        await conn.close();
        return;
    }
    
    console.log("fetch-linkstats: database connected OK");

    while(true) {
        try {
            await pollDevice();
        } catch (error) {
            console.log('fetch-linkstats: ', error);
        }
        await delay(errorDelayMs);
    }
};

main();
