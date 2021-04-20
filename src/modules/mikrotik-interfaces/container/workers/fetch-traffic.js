const RosApi = require('node-routeros').RouterOSAPI;
const delay = require('delay');
const mongoCollection = require('../utils/mongo-collection');
const mikrotikFetchTraffic = require('../services/mikrotik-fetchtraffic');
const arraySave = require('../services/array-save');
const interfaceList = require('../services/interface-list');
const myPanelId = 'bug-containers'; // 'thisisapanelidhonest'; //TODO
const mongoDb = require('../utils/mongo-db');
const trafficAddHistory = require('../services/traffic-addhistory');

const main = async () => {

    const delayMs = 2000;
    const conn = new RosApi({
        host: '172.26.108.126',
        user: 'bug',
        password: 'sfsafawffasfasr33r',
        timeout: 5


    });

    console.log('fetch-traffic: starting ...');

    // initial delay (to stagger device polls)
    await delay(2000);

    console.log(`fetch-traffic: connecting to database`);
    try {
        await mongoDb.connect(myPanelId);
    } catch (error) {
        console.log("fetch-traffic: error connecting to database");
        return;
    }

    const trafficCollection = await mongoCollection('traffic');
    if (!trafficCollection) {
        return;
    }
    console.log("fetch-traffic: database connected OK");

    console.log("fetch-traffic: connecting to device");
    try {
        await conn.connect();
    } catch (error) {
        console.log('fetch-traffic: error connecting to device');
        return false;
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

main();