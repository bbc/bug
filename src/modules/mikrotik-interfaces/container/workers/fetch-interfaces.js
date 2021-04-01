const RosApi = require('node-routeros').RouterOSAPI;
const delay = require('delay');
const db = require('../utils/db');
const bitrate = require('bitrate');
var dbInterfaces = null;

const delayMs = 2000;
const conn = new RosApi({
    host: "172.26.108.126",
    user: "bug",
    password: "sfsafawffasfasr33r",
    timeout: 5
});

async function getInterfaces() {

    // print the interface menu
    try {
        var data = await conn.write("/interface/print");
    } catch (error) {
        console.log("error fetching interface information");
        return;
    }

    // process data
    var interfaces = [];
    for (var i in data) {
        interfaces.push(parseInterface(data[i]));
    }
    return interfaces;
};

async function saveInterfaces(interfaces) {

    try {
        await Promise.all(interfaces.map(async (eachInterface) => {

            var existingInterface = await dbInterfaces.findOne({'id': eachInterface['id']});
            if(existingInterface !== null) {
                // found previous
                timeDiff = eachInterface['timestamp'] - existingInterface['timestamp'];
                byteDiff = parseFloat(eachInterface["rx-byte"]) - parseFloat(existingInterface["rx-byte"]);
                eachInterface["rx-kbps"] = parseFloat(bitrate(byteDiff, timeDiff).toFixed(2));
                eachInterface["rx-bps-text"] = bitrate(byteDiff, timeDiff, 'mbps').toFixed(2) + " Mb/s";
                
                // we've used it, now replace it
                var result = await dbInterfaces.update(
                    {'id': eachInterface['id']},
                    eachInterface
                );

            }
            else {
                await dbInterfaces.insert(eachInterface);
            }
        }));

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
            const interfaces = await getInterfaces();
            await saveInterfaces(interfaces);
        } catch (error) {
            console.log(error);
            noErrors = true;
        }
        await delay(delayMs);
    }
    await conn.close();
}

const integerFields = [
    'mtu',
    'actual-mtu',
    'l2mtu',
    'max-l2mtu',
    'link-downs',
    'rx-byte',
    'tx-byte',
    'rx-packet',
    'tx-packet',
    'rx-drop',
    'tx-drop',
    'tx-queue-drop',
    'tx-error',
    'rx-error',
    'fp-rx-byte',
    'fp-tx-byte',
    'fp-rx-packet',
    'fp-tx-packet'
];

const booleanFields = [
    'running',
    'slave',
    'disabled'
];

const parseInterface = (interface) => {
    for (var i in integerFields) {
        if (integerFields[i] in interface) {
            interface[integerFields[i]] = parseInt(interface[integerFields[i]]) ?? 0;
        }
    }
    for (var i in booleanFields) {
        if (booleanFields[i] in interface) {
            interface[booleanFields[i]] = (interface[booleanFields[i]] === 'true');
        }
    }
    // overwrite '.id' field with 'id'
    interface['id'] = interface['.id'];
    delete interface['.id'];

    // add timestamp
    interface['timestamp'] = Date.now();
    return interface;
}

main();


// write to database


// Counter to trigger pause/resume/stop
// let i = 0;

// // The stream function returns a Stream object which can be used to pause/resume/stop the stream
// const addressStream = conn.stream(['/tool/torch', '=interface=ether11-wan1'], (error, packet) => {
//     // If there is any error, the stream stops immediately
//     if (!error) {
//         console.log(packet);

//         // Increment the counter
//         i++;

//         // if the counter hits 30, we stop the stream
//         if (i === 10) {

//             // Stopping the stream will return a promise
//             addressStream.stop().then(() => {
//                 console.log('should stop');
//                 // Once stopped, you can't start it again
//                 conn.close();
//             }).catch((err) => {
//                 console.log(err);
//             });

//         } else if (i % 5 === 0) {

//             // If the counter is multiple of 5, we will pause it
//             addressStream.pause().then(() => {
//                 console.log('should be paused');

//                 // And after it is paused, we resume after 3 seconds
//                 setTimeout(() => {
//                     addressStream.resume().then(() => {
//                         console.log('should resume');
//                     }).catch((err) => {
//                         console.log(err);
//                     });
//                 }, 3000);

//             }).catch((err) => {
//                 console.log(err);
//             });

//         }

//     }else{
//         console.log(error);
//     }
// });

// }).catch((err) => {
//     // Got an error while trying to connect
//     console.log(err);
// });



// const RouterOSClient = require('routeros-client').RouterOSClient;

// const api = new RouterOSClient({
//     host: "172.24.63.254",
//     user: "admin",
//     password: "facs1655"
// });

// api.connect().then((client) => {
//     // After connecting, the promise will return a client class so you can start using it

//     // You can either use spaces like the winbox terminal or
//     // use the way the api does like "/system/identity", either way is fine
//     client.menu("/system identity").getOnly().then((result) => {
//         console.log(result.identity); // Mikrotik
//         api.close();
//     }).catch((err) => {
//         console.log(err); // Some error trying to get the identity
//     });

// }).catch((err) => {
//     // Connection error
// });

