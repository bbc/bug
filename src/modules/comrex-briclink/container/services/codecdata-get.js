// "use strict";

// const mongoSingle = require("@core/mongo-single");
// const deviceIdGet = require("@services/deviceid-get");

// module.exports = async () => {
//     // fetch hashed address of device to use as id
//     const deviceId = await deviceIdGet();

//     // fetch codec data
//     const codecData = await mongoSingle.get("codecdata");

//     // fetch local data
//     const localData = await mongoSingle.get(`localdata_${deviceId}`);

//     // merge and return the two
//     return Object.assign(codecData, localData);
// };
