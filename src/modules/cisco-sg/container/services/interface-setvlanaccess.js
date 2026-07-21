"use strict";

const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");
const ciscoSGSSH = require("@utils/ciscosg-ssh");
const mongoSingle = require("@core/mongo-single");
const deviceSetPending = require("@services/device-setpending");
const logger = require("@core/logger")(module);

module.exports = async (interfaceId, untaggedVlan = "1") => {
    try {
        if (!interfaceId) {
            throw new Error("interfaceId is required");
        }

        if (!untaggedVlan) {
            throw new Error("untaggedVlan is required");
        }

        const config = await configGet();
        if (!config) {
            throw new Error("failed to load config");
        }

        logger.info(`setting VLAN ${untaggedVlan} on interface ${interfaceId}`);

        const interfaceCollection = await mongoCollection("interfaces");
        const iface = await interfaceCollection.findOne({ interfaceId: Number(interfaceId) });
        if (!iface) {
            throw new Error(`interface ${interfaceId} not found`);
        }

        logger.info(`interface ${interfaceId} found in DB`);

        const system = await mongoSingle.get("system");

        const commands = ["conf", `interface ${iface.longId}`];
        const commandOptions = {
            1: "switchport trunk allowed vlan remove all",
            2: "switchport trunk allowed vlan none",
        };

        if (iface["tagged-vlans"].length > 0) {
            commands.push(commandOptions[system["control-version"]]);
        }

        commands.push("switchport mode access");
        commands.push(`switchport access vlan ${untaggedVlan}`);

        logger.info(`sending commands to switch: ${JSON.stringify(commands)}`);

        const result = await ciscoSGSSH({
            host: config.address,
            username: config.username,
            password: config.password,
            timeout: 10000,
            commands: commands,
        });

        for (const eachResult of result) {
            if (eachResult.includes("Unrecognized command")) {
                throw new Error(eachResult);
            }
        }

        logger.info("success - updating DB");

        const lastUpdated = new Date();
        const dbResult = await interfaceCollection.updateOne(
            { interfaceId: Number(interfaceId) },
            { $set: { "untagged-vlan": Number(untaggedVlan), "tagged-vlans": [], lastUpdated } }
        );

        if (dbResult.matchedCount !== 1) {
            throw new Error(`expected to update 1 interface in DB, matched ${dbResult.matchedCount}`);
        }

        logger.info(`${JSON.stringify(dbResult.result)}`);

        await deviceSetPending(true);

        return true;
    } catch (err) {
        err.message = `${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};
