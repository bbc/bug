const RosApi = require('node-routeros').RouterOSAPI;
const delay = require('delay');
const mongoCollection = require('../utils/mongo-collection');
const mikrotikFetchInterfaces = require('../services/mikrotik-fetchinterfaces');
const mikrotikFetchLinkStats = require('../services/mikrotik-fetchlinkstats');
const arraySave = require('../services/array-save');
const interfaceList = require('../services/interface-list');

const main = async () => {

    const delayMs = 5000;
    const conn = new RosApi({
        host: '172.26.108.126',
        user: 'bug',
        password: 'sfsafawffasfasr33r',
        timeout: 10
    });

    console.log('fetch-linkstats: starting ...');

    // initial delay (to stagger device polls)
    await delay(1000);

    console.log(`fetch-linkstats: connecting to database`);
    const db = await mongoCollection('linkstats');
    if (!db) {
        return;
    }

    console.log("fetch-linkstats: database connected OK");
    console.log("fetch-linkstats: connecting to device");
    try {
        await conn.connect();
    } catch (error) {
        console.log('fetch-linkstats: error connecting to device');
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
            await arraySave(db, linkStatsArray, 'name');
        } catch (error) {
            console.log('fetch-linkstats: ', error);
            noErrors = true;
        }
        await delay(delayMs);
    }
    await conn.close();
}

main();