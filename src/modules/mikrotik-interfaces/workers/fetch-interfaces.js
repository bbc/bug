const RosApi = require('node-routeros').RouterOSAPI;
// const db = require('../utils/db');
const delay = require('delay');
const delayMs = 2000;
const conn = new RosApi({
    host: "172.24.63.254",
    user: "admin",
    password: "facs1655"
});

const poll = async () => {

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
    console.log(interfaces);
    // update the database
    try {

    } catch (error) {

    }

};

const main = async () => {
    // connect
    try {
        await conn.connect();
    } catch (error) {
        console.log("error connecting to device");
    }
    //TODO add connection state to DB which gets read by UI


    const noErrors = true;
    while (noErrors) {
        try {
            await poll();
        } catch (error) {
            noErrors = true;
        }
        await delay(2000);
        console.log("loop");
    }

    await conn.close();
    console.log("done");

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
            interface[integerFields[i]] = parseInt(interface[integerFields[i]]);
        }
    }
    for (var i in booleanFields) {
        if (booleanFields[i] in interface) {
            interface[booleanFields[i]] = (interface[booleanFields[i]] === 'true');
        }
    }
    return interface;
}