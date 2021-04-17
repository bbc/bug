const RosApi = require('node-routeros').RouterOSAPI;
const delay = require('delay');
const mongoCollection = require('../utils/mongo-collection');
const mikrotikFetchInterfaces = require('../services/mikrotik-fetchinterfaces');
const mikrotikFetchLinkStats = require('../services/mikrotik-fetchlinkstats');
const arraySave = require('../services/array-save');

const main = async () => {

    const delayMs = 2000;
    const conn = new RosApi({
        host: '172.26.108.126',
        user: 'bug',
        password: 'sfsafawffasfasr33r',
        timeout: 5
    });

    console.log('fetch-linkstats: starting ...');

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
            const interfaces = await mikrotikFetchInterfaces(conn);
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