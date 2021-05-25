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
