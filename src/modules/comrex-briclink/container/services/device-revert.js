// "use strict";

// const mongoSingle = require("@core/mongo-single");
// const deviceIdGet = require("@services/deviceid-get");

// module.exports = async () => {
//     // fetch hashed address of device to use as id
//     const deviceId = await deviceIdGet();

//     // overwrite localdata with nothing
//     return await mongoSingle.set(`localdata_${deviceId}`, {});
// };
