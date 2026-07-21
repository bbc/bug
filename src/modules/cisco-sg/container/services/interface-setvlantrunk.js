"use strict";

const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");
const ciscoSGSSH = require("@utils/ciscosg-ssh");
const mongoSingle = require("@core/mongo-single");
const ciscoSGVlanRanges = require("@utils/ciscosg-vlanranges");
const ciscoSGVlanArray = require("@utils/ciscosg-vlanarray");
const deviceSetPending = require("@services/device-setpending");
const logger = require("@core/logger")(module);

module.exports = async (interfaceId, untaggedVlan = 1, taggedVlans = []) => {
    try {
        if (!interfaceId) {
            throw new Error("interfaceId is required");
        }

        if (!untaggedVlan) {
            throw new Error("untaggedVlan is required");
        }

        if (!Array.isArray(taggedVlans)) {
            throw new Error("taggedVlans must be an array");
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

        const allVlans = await mongoSingle.get("vlans");
        const system = await mongoSingle.get("system");

        const vlanArray = ciscoSGVlanArray(allVlans, taggedVlans);
        const commands = ["conf", `interface ${iface.longId}`, "switchport mode trunk"];

        if (String(untaggedVlan) !== "1") {
            commands.push(`switchport trunk native vlan ${untaggedVlan}`);
        }

        if (taggedVlans.length > 0) {
            if (system["control-version"] === 1) {
                if (taggedVlans.length === 1 && taggedVlans[0] === "1-4094") {
                    commands.push("switchport trunk allowed vlan add all");
                } else {
                    commands.push("switchport trunk allowed vlan remove all");
                    for (const vlan of vlanArray) {
                        commands.push(`switchport trunk allowed vlan add ${vlan}`);
                    }
                }
            } else if (system["control-version"] === 2) {
                taggedVlans.push(untaggedVlan);
                const vlanRanges = ciscoSGVlanRanges(allVlans, taggedVlans);
                commands.push("switchport trunk allowed vlan none");
                for (const vlan of vlanRanges) {
                    commands.push(`switchport trunk allowed vlan add ${vlan}`);
                }
            } else {
                throw new Error(`unsupported control-version: ${system["control-version"]}`);
            }
        }

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
            { $set: { "untagged-vlan": Number(untaggedVlan), "tagged-vlans": vlanArray, lastUpdated } }
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
