"use strict";

const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");
const aristaApi = require("@utils/arista-api");

module.exports = async (interfaceId) => {
    const config = await configGet();

    console.log(`interface-disable: disabling interface ${interfaceId} ...`);

    await aristaApi({
        host: config.address,
        protocol: "https",
        port: 443,
        username: config.username,
        password: config.password,
        commands: ["enable", "configure", `interface ${interfaceId}`, "shutdown"],
    });

    console.log(`interface-disable: success - updating DB`);
    try {
        const interfacesCollection = await mongoCollection("interfaces");

        const dbResult = await interfacesCollection.updateOne(
            { interfaceId: interfaceId },
            { $set: { linkStatus: "disabled" } }
        );
        console.log(`interface-disable: ${JSON.stringify(dbResult.result)}`);
        return true;
    } catch (error) {
        console.log(`interface-disable: failed to update db`);
        console.log(error);
    }
    return false;
};
