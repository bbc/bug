const RosApi = require('node-routeros').RouterOSAPI;
const delay = require('delay');
const mongoCollection = require('../utils/mongo-collection');
const mikrotikFetchInterfaces = require('../services/mikrotik-fetchinterfaces');
const arraySave = require('../services/array-save');
const myPanelId = 'bug-containers'; // 'thisisapanelidhonest'; //TODO
const mongoDb = require('../utils/mongo-db');

const main = async () => {

    const delayMs = 2000;
    const conn = new RosApi({
        host: "172.26.108.126",
        user: "bug",
        password: "sfsafawffasfasr33r",
        timeout: 5
    });

    console.log("fetch-interfaces: starting ...");

    console.log(`fetch-interfaces: connecting to database`);
    try {
        await mongoDb.connect(myPanelId);
    } catch (error) {
        console.log("fetch-interfaces: error connecting to database");
        return;
    }

    const interfacesCollection = await mongoCollection('interfaces');
    if (!interfacesCollection) {
        return;
    }
    console.log("fetch-interfaces: database connected OK");
    
    console.log("fetch-interfaces: connecting to device");
    try {
        await conn.connect();
    } catch (error) {
        console.log("fetch-interfaces: error connecting to device");
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
            console.log(error);
            noErrors = true;
        }
        await delay(delayMs);
    }
    await conn.close();
}

main();

