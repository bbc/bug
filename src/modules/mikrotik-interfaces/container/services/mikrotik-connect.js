const RosApi = require("node-routeros").RouterOSAPI;
const configGet = require("../services/config-get");

module.exports = async () => {
    let config;
    try {
        config = await configGet();
        if (!config) {
            throw new Error();
        }
    } catch (error) {
        console.log(`mikrotik-connect: failed to fetch config`);
        return null;
    }

    const conn = new RosApi({
        host: config.address,
        user: config.username,
        password: config.password,
        timeout: 5,
    });

    try {
        console.log("mikrotik-connect: connecting to device " + JSON.stringify(conn));
        await conn.connect();
    } catch (error) {
        console.log("mikrotik-connect: failed to connect to device");
        return;
    }
    console.log("mikrotik-connect: device connected ok");
    return conn;
};
