const RosApi = require('node-routeros').RouterOSAPI;
const delay = require('delay');
const mongoCollection = require('../utils/mongo-collection');
const mikrotikFetchInterfaces = require('../services/mikrotik-fetchinterfaces');
const arraySave = require('../services/array-save');
const myPanelId = 'bug-containers'; // 'thisisapanelidhonest'; //TODO
const mongoDb = require('../utils/mongo-db');
const delayMs = 2000;
const errorDelayMs = 10000;
let interfacesCollection;

process.on('uncaughtException', function(err) {
    console.log("fetch-interfaces: device poller failed ... restarting");
    main();
});

const pollDevice = async () => {

    const conn = new RosApi({
        host: "172.26.108.126",
        user: "bug",
        password: "sfsafawffasfasr33r",
        timeout: 5
    });

    console.log("fetch-interfaces: starting ...");
    
    try {
        console.log("fetch-interfaces: connecting to device " + JSON.stringify(conn));
        await conn.connect();
    } catch (error) {
        console.log("fetch-interfaces: failed to connect to device");
        return;
    }
    console.log("fetch-interfaces: device connected ok");

    var noErrors = true;
    console.log("fetch-interfaces: starting device poll....");
    while (noErrors) {
        try {
            const interfaces = await mikrotikFetchInterfaces(conn);
            await arraySave(interfacesCollection, interfaces, 'id');
        } catch (error) {
            console.log('fetch-interfaces: ', error);
            noErrors = true;
        }
        await delay(delayMs);
    }
    await conn.close();
}

const main = async () => {

    try {
        console.log(`fetch-interfaces: connecting to database`);
        await mongoDb.connect(myPanelId);

    } catch (error) {
        console.log("fetch-interfaces: error connecting to database");
        return;
    }

    interfacesCollection = await mongoCollection('interfaces');

    if (!interfacesCollection) {
        console.log("fetch-interfaces: error fetching database collection");
        await conn.close();
        return;
    }
    
    console.log("fetch-interfaces: database connected OK");

    while(true) {
        try {
            await pollDevice();
        } catch (error) {
            console.log('fetch-interfaces: ', error);
        }
        await delay(errorDelayMs);
    }
};

main();