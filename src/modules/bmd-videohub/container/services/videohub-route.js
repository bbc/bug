"use strict";

const configGet = require("@core/config-get");
const videohub = require("@utils/videohub-promise");

module.exports = async (destinatonIndex, sourceIndex) => {
    let config;
    try {
        config = await configGet();
        if (!config) {
            throw new Error();
        }
    } catch (error) {
        console.log(`videohub-connect: failed to fetch config`);
        return false;
    }

    try {
        const router = new videohub({ port: config.port, host: config.address });
        await router.connect();
        await router.send("VIDEO OUTPUT ROUTING", `${destinatonIndex} ${sourceIndex}`);
        return true;
    } catch (error) {
        console.log("videohub-send: ", error);
        return false;
    }

    // const videohub = await videohubSend(destinatonIndex, sourceIndex);
    // console.log(videohub);
    // console.log(videohub.route(sourceIndex, destinatonIndex));
};

// Router.prototype.route = function (output, input) {
//     const instance = this;
//     return new Promise((resolve, reject) => {
//         let str = [`VIDEO OUTPUT ROUTING:`, `${output} ${input}`].join("\n");
//         str += "\n\n";

//         try {
//             instance.socket.write(str, () => {
//                 setTimeout(() => {
//                     resolve();
//                 }, 100);
//             });
//         } catch (error) {
//             reject(new Error(error));
//         }
//     });
// };

// "use strict";

// const configGet = require("@core/config-get");
// const videohub = require("@utils/videohub-promise");

// module.exports = async (destination, source) => {
//     let config;
//     try {
//         config = await configGet();
//         if (!config) {
//             throw new Error();
//         }
//     } catch (error) {
//         console.log(`videohub-connect: failed to fetch config`);
//         return null;
//     }

//     try {
//         const router = new videohub({ port: config.port, host: config.address });
//         router.on("update", (data) => {
//             console.log("data", data);
//         });
//         await router.connect();
//         await router.route(destination, source);
//         return true;
//     } catch (error) {
//         console.log("videohub-send: ", error);
//         return;
//     }
// };
