"use strict";

const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");
const aristaApi = require("@utils/arista-api");

module.exports = async (interfaceId) => {
    const config = await configGet();

    console.log(`interface-enable: disabling interface ${interfaceId} ...`);

    await aristaApi({
        host: config.address,
        protocol: "https",
        port: 443,
        username: config.username,
        password: config.password,
        commands: ["enable", "configure", `interface ${interfaceId}`, "no shutdown"],
    });

    console.log(`interface-enable: success - updating DB`);
    try {
        const interfacesCollection = await mongoCollection("interfaces");
        const dbInterface = await interfacesCollection.findOne({ interfaceId });
        if (!dbInterface) {
            console.log(`interface-enable: can't find interface ${interfaceId} in db to update`);
            return false;
        }
        // if the linkstatus is up, we're going to pretend the interface is connected
        const linkStatus = dbInterface.linkProtocolStatus === "up" ? "connected" : "notconnect";
        const dbResult = await interfacesCollection.updateOne({ interfaceId: interfaceId }, { $set: { linkStatus } });
        console.log(`interface-enable: ${JSON.stringify(dbResult.result)}`);
        return true;
    } catch (error) {
        console.log(`interface-enable: failed to update db`);
        console.log(error);
        return false;
    }
};
