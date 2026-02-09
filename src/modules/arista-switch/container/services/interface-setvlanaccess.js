"use strict";

const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");
const aristaApi = require("@utils/arista-api");
const deviceSetPending = require("@services/device-setpending");
const logger = require("@core/logger")(module);

module.exports = async (interfaceId, untaggedVlan = "1") => {
    try {
        const config = await configGet();
        if (!config) {
            throw new Error("failed to load config");
        }

        logger.info(`interface-setvlanaccess: setting vlan ${untaggedVlan} on interface ${interfaceId}`);

        const interfaceCollection = await mongoCollection("interfaces");
        const iface = await interfaceCollection.findOne({ interfaceId: interfaceId });
        if (!iface) {
            throw new Error(`interface ${interfaceId} not found`);
        }

        const commands = ["enable", "configure", `interface ${interfaceId}`];

        // if the interface is currently in trunk mode, change it
        if (iface.mode === "trunk") {
            logger.info(`interface-setvlanaccess: interface ${interfaceId} is in trunk mode, changing to access`);
            commands.push("no switchport trunk native vlan");
            commands.push("switchport mode access");
        }

        // now change the access vlan
        commands.push(`switchport access vlan ${untaggedVlan}`);

        await aristaApi({
            host: config.address,
            protocol: "https",
            port: 443,
            username: config.username,
            password: config.password,
            commands: commands,
        });

        logger.info(`interface-setvlanaccess: success - updating DB`);

        // update db
        const dbResult = await interfaceCollection.updateOne(
            { interfaceId: interfaceId },
            { $set: { mode: "access", accessVlanId: parseInt(untaggedVlan) } }
        );
        logger.info(`interface-setvlanaccess: ${JSON.stringify(dbResult.result)}`);
        await deviceSetPending(false);
        return true;
    } catch (error) {
        err.message = `interface-setvlanaccess(${interfaceId}): ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};
