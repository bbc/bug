"use strict";

const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");
const aristaApi = require("@utils/arista-api");

module.exports = async (interfaceId) => {
    try {
        const config = await configGet();

        console.log(`interface-enable: enabling interface ${interfaceId} ...`);

        // enable the interface on the device
        await aristaApi({
            host: config.address,
            protocol: "https",
            port: 443,
            username: config.username,
            password: config.password,
            commands: ["enable", "configure", `interface ${interfaceId}`, "no shutdown"],
        });

        console.log(`interface-enable: success - updating DB`);

        // update the DB to reflect enabled interface
        const interfacesCollection = await mongoCollection("interfaces");
        const dbInterface = await interfacesCollection.findOne({ interfaceId });

        if (!dbInterface) {
            console.log(`interface-enable: can't find interface ${interfaceId} in db to update`);
            return false;
        }

        // determine link status based on linkProtocolStatus
        const linkStatus = dbInterface.linkProtocolStatus === "up" ? "connected" : "notconnect";

        const dbResult = await interfacesCollection.updateOne(
            { interfaceId },
            { $set: { linkStatus } }
        );

        console.log(`interface-enable: ${JSON.stringify(dbResult.result)}`);
        return true;

    } catch (err) {
        err.message = `interface-disable(${interfaceId}): ${err.stack || err.message || err}`;
        throw err;
    }
};
