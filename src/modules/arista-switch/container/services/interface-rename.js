"use strict";

const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");
const aristaApi = require("@utils/arista-api");

module.exports = async (interfaceId, newName) => {
    const config = await configGet();

    console.log(`interface-rename: renaming interface ${interfaceId} to '${newName}' ...`);

    const descriptionCommand = newName ? `description ${newName}` : "no description";

    await aristaApi({
        host: config.address,
        protocol: "https",
        port: 443,
        username: config.username,
        password: config.password,
        commands: ["enable", "configure", `interface ${interfaceId}`, descriptionCommand],
    });

    console.log(`interface-rename: success - updating DB`);
    try {
        const interfacesCollection = await mongoCollection("interfaces");
        const dbResult = await interfacesCollection.updateOne(
            { interfaceId: interfaceId },
            { $set: { description: newName } }
        );
        console.log(`interface-rename: ${JSON.stringify(dbResult.result)}`);
        return true;
    } catch (error) {
        console.log(`interface-rename: failed to update db`);
        console.log(error);
        return false;
    }
};
