// "use strict";

// const mikrotikConnect = require("../utils/mikrotik-connect");

// module.exports = async (interfaceName) => {
//     const conn = await mikrotikConnect();
//     if (!conn) {
//         return;
//     }

//     try {
//         await conn.write("/interface/disable", ["=numbers=" + interfaceName]);
//         console.log(`mikrotik-interfacedisable: disabled interface ${interfaceName}`);
//         conn.close();
//         return true;
//     } catch (error) {
//         console.log(`mikrotik-interfacedisable: ${error.stack || error.trace || error || error.message}`);
//         conn.close();
//         return false;
//     }
// };
