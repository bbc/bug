// "use strict";

// const mongoSingle = require("@core/mongo-single");

// module.exports = async (streamType) => {
//     // fetch codec data
//     let codecData = await mongoSingle.get("codecdb");

//     if (streamType) {
//         codecData = codecData.filter((codec) => codec.capabilities.includes(streamType));
//     }
//     return codecData.map((codec) => {
//         return {
//             id: codec.id,
//             name: codec.name,
//             address: codec.address,
//             port: codec.port,
//             device: `${codec.devicemanufacturer} ${codec.devicemodel}`,
//         };
//     });
// };
