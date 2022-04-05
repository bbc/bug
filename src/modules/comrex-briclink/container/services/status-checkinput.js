// "use strict";

// const StatusItem = require("@core/StatusItem");
// const mongoSingle = require("@core/mongo-single");

// module.exports = async () => {
//     const codecData = await mongoSingle.get("codecdata");

//     const encoderStatus =
//         codecData?.outputs_0_StreamTransmission === 0 || codecData?.outputs_1_StreamTransmission === 0;
//     const inputStatus = codecData?.InputSignal === 1;

//     if (encoderStatus && !inputStatus) {
//         // we're encoding but there's no input
//         return [
//             new StatusItem({
//                 key: `input`,
//                 message: [`No input signal detected`],
//                 type: "warning",
//             }),
//         ];
//     }

//     return [];
// };
