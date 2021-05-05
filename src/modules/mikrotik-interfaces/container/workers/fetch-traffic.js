const RosApi = require('node-routeros').RouterOSAPI;
const delay = require('delay');
const mongoCollection = require('../utils/mongo-collection');
const mikrotikFetchTraffic = require('../services/mikrotik-fetchtraffic');
const arraySave = require('../services/array-save');
const interfaceList = require('../services/interface-list');
const configGet = require("../services/config-get");
const mongoDb = require('../utils/mongo-db');
const trafficAddHistory = require('../services/traffic-addhistory');
const delayMs = 2000;
const errorDelayMs = 10000;
let trafficCollection;
let config;

process.on('uncaughtException', function(err) {
    console.log("fetch-traffic: device poller failed ... restarting");
    main();
});

const pollDevice = async () => {

    const conn = new RosApi({
        host: config.address,
        user: config.username,
        password: config.password,
        timeout: 5
    });

    console.log('fetch-traffic: starting ...');

    // initial delay (to stagger device polls)
    await delay(2000);

    try {
        console.log("fetch-traffic: connecting to device " + JSON.stringify(conn));
        await conn.connect();
    } catch (error) {
        console.log("fetch-traffic: failed to connect to device");
        return;
    }
    console.log("fetch-traffic: device connected ok");

    var noErrors = true;
    console.log('fetch-traffic: starting device poll....');
    while (noErrors) {
        try {
            // fetch interface list from db (empty if not yet fetched)
            const interfaces = await interfaceList();

            // fetch traffic stats for each interface
            let trafficArray = [];
            if(interfaces) {
                for(eachInterface of interfaces) {
                    trafficArray.push(await mikrotikFetchTraffic(conn, eachInterface['name']));
                }
            }

            // add historical data (for sparklines)
            trafficArray = await trafficAddHistory(trafficCollection, trafficArray);

            await arraySave(trafficCollection, trafficArray, 'name');
        } catch (error) {
            console.log('fetch-traffic: ', error);
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
        console.log("fetch-traffic: got config OK");
    } catch (error) {
        console.log(`fetch-traffic: failed to fetch config`);
        return;
    }

    try {
        console.log(`fetch-traffic: connecting to database`);
        await mongoDb.connect(config.id);

    } catch (error) {
        console.log("fetch-traffic: error connecting to database");
        return;
    }

    trafficCollection = await mongoCollection('traffic');

    if (!trafficCollection) {
        console.log("fetch-traffic: error fetching database collection");
        await conn.close();
        return;
    }
    
    console.log("fetch-traffic: database connected OK");

    while(true) {
        try {
            await pollDevice();
        } catch (error) {
            console.log('fetch-traffic: ', error);
        }
        await delay(errorDelayMs);
    }
};

main();
