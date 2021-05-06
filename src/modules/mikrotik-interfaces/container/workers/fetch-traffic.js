const { parentPort, workerData, threadId } = require('worker_threads');

const RosApi = require('node-routeros').RouterOSAPI;
const delay = require('delay');

const mikrotikFetchTraffic = require('../services/mikrotik-fetchtraffic');
const arraySave = require('../services/array-save');
const interfaceList = require('../services/interface-list');
const configGet = require("../services/config-get");
const trafficAddHistory = require('../services/traffic-addhistory');

const delayMs = 2000;
const errorDelayMs = 10000;
const config = workerData.config;

//Tell the manager the things you care about
parentPort.postMessage({
    index: workerData.index,
    restartOn: ['address', 'username', 'password']
});

const pollDevice = async () => {

    const trafficCollection = await workerData.db.collection('traffic')
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
            if (interfaces) {
                for (eachInterface of interfaces) {
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

while (true) {
    try {
        pollDevice();
    } catch (error) {
        console.log('fetch-traffic: ', error);
    }
    delay(errorDelayMs);
}