const RosApi = require('node-routeros').RouterOSAPI;
const delay = require('delay');
const db = require('../utils/db');
const mikrotikFetchInterfaces = require('../services/mikrotik-fetchinterfaces');
const mikrotikFetchTraffic = require('../services/mikrotik-fetchtraffic');

var dbTraffic = null;

const delayMs = 2000;
const conn = new RosApi({
    host: '172.26.108.126',
    user: 'bug',
    password: 'sfsafawffasfasr33r',
    timeout: 5
});

async function saveTraffic(trafficArray) {
    for(eachInterface of trafficArray) {
        try {
            await dbTraffic.update({ name: eachInterface['name']}, eachInterface, { upsert: true });
        } catch (error) {
            console.log(error);
        }
    }
}

const main = async () => {

    console.log('fetch-traffic: starting ...');

    console.log(`fetch-traffic: connecting to database`);
    dbTraffic = await db('traffic');

    if(!dbTraffic) {
        console.log('fetch-traffic: no database - cannot continue');
        return;
    }

    console.log('fetch-traffic: database connected OK');

    try {
        await conn.connect();
    } catch (error) {
        console.log('fetch-traffic: error connecting to device');
        return false;
    }

    var noErrors = true;
    console.log('fetch-traffic: starting device poll....');
    while (noErrors) {
        try {
            const interfaces = await mikrotikFetchInterfaces(conn);
            let trafficArray = [];
            if(interfaces) {
                for(eachInterface of interfaces) {
                    trafficArray.push(await mikrotikFetchTraffic(conn, eachInterface['name']));
                }
            }
            await saveTraffic(trafficArray);
        } catch (error) {
            console.log('fetch-traffic: ', error);
            noErrors = true;
        }
        await delay(delayMs);
    }
    await conn.close();
}

main();