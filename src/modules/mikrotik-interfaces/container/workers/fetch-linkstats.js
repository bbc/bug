const RosApi = require('node-routeros').RouterOSAPI;
const delay = require('delay');
const db = require('../utils/db');
const mikrotikFetchInterfaces = require('../services/mikrotik-fetchinterfaces');
const mikrotikFetchLinkStats = require('../services/mikrotik-fetchlinkstats');
const mikrotikParseLinkStats = require('../services/mikrotik-parselinkstats');

var dbLinkStats = null;

const delayMs = 5000;
const conn = new RosApi({
    host: '172.26.108.126',
    user: 'bug',
    password: 'sfsafawffasfasr33r',
    timeout: 5
});

async function saveLinkStats(linkStatsArray) {
    for(eachInterface of linkStatsArray) {
        try {
            await dbLinkStats.update({ name: eachInterface['name']}, eachInterface, { upsert: true });
        } catch (error) {
            console.log(error);
        }
    }
}

const main = async () => {

    console.log('fetch-linkstats: starting ...');

    console.log(`fetch-linkstats: connecting to database`);
    dbLinkStats = await db('linkstats');

    if(!dbLinkStats) {
        console.log('fetch-linkstats: no database - cannot continue');
        return;
    }

    console.log('fetch-linkstats: database connected OK');

    try {
        await conn.connect();
    } catch (error) {
        console.log('fetch-linkstats: error connecting to device');
    }

    var noErrors = true;
    console.log('fetch-linkstats: starting device poll....');
    while (noErrors) {
        try {
            const interfaces = await mikrotikFetchInterfaces(conn);
            let linkStatsArray = [];
            if(interfaces) {
                for(eachInterface of interfaces) {
                    if(eachInterface['type'] === 'ether') {
                        linkStatsArray.push(await mikrotikFetchLinkStats(conn, eachInterface['name']));
                    }
                }
            }
            await saveLinkStats(linkStatsArray);
        } catch (error) {
            console.log('fetch-linkstats: ', error);
            noErrors = true;
        }
        await delay(delayMs);
    }
    await conn.close();
}

main();