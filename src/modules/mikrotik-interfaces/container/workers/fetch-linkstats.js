const RosApi = require('node-routeros').RouterOSAPI;
const delay = require('delay');
const mongoCollection = require('../utils/mongo-collection');
const mikrotikFetchInterfaces = require('../services/mikrotik-fetchinterfaces');
const mikrotikFetchLinkStats = require('../services/mikrotik-fetchlinkstats');
const arraySave = require('../services/array-save');
const interfaceList = require('../services/interface-list');
const myPanelId = 'bug-containers'; // 'thisisapanelidhonest'; //TODO
const mongoDb = require('../utils/mongo-db');
const delayMs = 5000;
const errorDelayMs = 10000;
let linkStatsCollection;

process.on('uncaughtException', function(err) {
    console.log("fetch-linkstats: device poller failed ... restarting");
    main();
});

const pollDevice = async () => {

    const conn = new RosApi({
        host: '172.26.108.126',
        user: 'bug',
        password: 'sfsafawffasfasr33r',
        timeout: 10
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
        console.log(`fetch-linkstats: connecting to database`);
        await mongoDb.connect(myPanelId);

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
