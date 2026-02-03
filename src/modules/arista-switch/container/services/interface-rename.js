"use strict";

const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");
const aristaApi = require("@utils/arista-api");

module.exports = async (interfaceId, newName) => {
    try {
        const config = await configGet();
        if (!config) {
            throw new Error("failed to load config");
        }

        console.log(`interface-rename: renaming interface ${interfaceId} to '${newName}' ...`);

        const descriptionCommand = newName ? `description ${newName}` : "no description";

        // update device
        await aristaApi({
            host: config.address,
            protocol: "https",
            port: 443,
            username: config.username,
            password: config.password,
            commands: ["enable", "configure", `interface ${interfaceId}`, descriptionCommand],
        });

        console.log(`interface-rename: success - updating DB`);

        // update DB
        const interfacesCollection = await mongoCollection("interfaces");
        const dbResult = await interfacesCollection.updateOne(
            { interfaceId },
            { $set: { description: newName } }
        );

        console.log(`interface-rename: ${JSON.stringify(dbResult.result)}`);
        return true;

    } catch (err) {
        err.message = `interface-rename: ${err.stack || err.message || err}`;
        throw err;
    }
};
