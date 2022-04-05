// "use strict";

// const mongoSingle = require("@core/mongo-single");
// const deviceIdGet = require("@services/deviceid-get");

// module.exports = async () => {
//     // fetch hashed address of device to use as id
//     const deviceId = await deviceIdGet();

//     // fetch local data
//     const localData = await mongoSingle.get(`localdata_${deviceId}`);

//     return localData && Object.keys(localData).length > 0;
// };
