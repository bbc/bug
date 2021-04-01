const RosApi = require('node-routeros').RouterOSAPI;
const delay = require('delay');
const db = require('../utils/db');
const mikrotikFetchInterfaces = require('../services/mikrotik-fetchinterfaces');

var dbInterfaces = null;

const delayMs = 2000;
const conn = new RosApi({
    host: "172.26.108.126",
    user: "bug",
    password: "sfsafawffasfasr33r",
    timeout: 5
});

async function saveInterfaces(interfaces) {

    try {
        for(eachInterface of interfaces) {
            await dbInterfaces.update(
                {'id': eachInterface['id']},
                eachInterface,
                { upsert: true }
            );
        }

        // await Promise.all(interfaces.map(async (eachInterface) => {

        //     var existingInterface = await dbInterfaces.findOne({'id': eachInterface['id']});
        //     if(existingInterface !== null) {
        //         // found previous
        //         timeDiff = eachInterface['timestamp'] - existingInterface['timestamp'];

        //         // rxByteDiff = parseFloat(eachInterface["rx-byte"]) - parseFloat(existingInterface["rx-byte"]);
        //         // eachInterface["rx-kbps"] = parseFloat(bitrate(rxByteDiff, timeDiff).toFixed(2));
        //         // eachInterface["rx-bps-text"] = bitrate(rxByteDiff, timeDiff, 'mbps').toFixed(2) + " Mb/s";

        //         // txByteDiff = parseFloat(eachInterface["tx-byte"]) - parseFloat(existingInterface["tx-byte"]);
        //         // eachInterface["tx-kbps"] = parseFloat(bitrate(txByteDiff, timeDiff).toFixed(2));
        //         // eachInterface["tx-bps-text"] = bitrate(txByteDiff, timeDiff, 'mbps').toFixed(2) + " Mb/s";

        //         // we've used it, now replace it
        //         var result = await dbInterfaces.update(
        //             {'id': eachInterface['id']},
        //             eachInterface
        //         );

        //     }
        //     else {
        //         await dbInterfaces.insert(eachInterface);
        //     }
        // }));

    } catch (error) {
        console.log(error);
    }
}

const main = async () => {

    console.log("starting fetch-interfaces ...");

    console.log(`connecting to database collection 'interfaces'`);
    dbInterfaces = await db('interfaces');

    if(!dbInterfaces) {
        console.log("no database - cannot continue");
        return;
    }

    console.log("database connected OK");

    try {
        await conn.connect();
    } catch (error) {
        console.log("error connecting to device");
    }

    var noErrors = true;
    console.log("starting device poll....");
    while (noErrors) {
        try {
            const interfaces = await mikrotikFetchInterfaces(conn);
            await saveInterfaces(interfaces);
        } catch (error) {
            console.log(error);
            noErrors = true;
        }
        await delay(delayMs);
    }
    await conn.close();
}

main();

