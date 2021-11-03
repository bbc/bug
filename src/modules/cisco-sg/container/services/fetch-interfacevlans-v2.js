"use strict";

const ciscoSGSNMP = require("@utils/ciscosg-snmp");
const ciscoSGSSH = require("@utils/ciscosg-ssh");
const ciscoSGTableParser = require("@utils/ciscosg-tableparser");
const ciscoSGExpandPorts = require("@utils/ciscosg-expandports");
const mongoCollection = require("@core/mongo-collection");
const delay = require("delay");

const portModeAccess = 11;
const portModeTrunk = 12;

const convert = (from, to) => str => Buffer.from(str, from).toString(to)

const utf8ToHex = convert('utf8', 'hex')
const hex2bin = (hex) => {
    return (parseInt(hex, 16).toString(2)).padStart(8, '0');
}
const chunk = (str, size) => {
    return str.match(new RegExp('.{1,' + size + '}', 'g'));
}


module.exports = async (workerData) => {

    // get the collection reference
    const vlanCollection = await mongoCollection("vlans");
    const interfacesCollection = await mongoCollection("interfaces");

    // Kick things off
    console.log(`fetch-interfacevlans-v2: connecting to device at ${workerData.address}`);

    while (true) {

        // get the current list of vlans
        const vlanDocument = await vlanCollection.findOne({ "type": "vlans" });
        if (!vlanDocument || !vlanDocument.vlans) {
            await delay(1000);
        }
        else {

            // fetch info via SSH first
            const result = await ciscoSGSSH({
                host: workerData.address,
                username: workerData.username,
                password: workerData.password,
                commands: ["show vlan"]
            });

            if (!result || result.length !== 1) {
                console.log(`fetch-interfacevlans-v2: failed to get vlan list via SSH`);
                return;
            }
            const sshVlans = ciscoSGTableParser(result[0]);

            const interfaceVlans = {}
            for (let eachVlan of sshVlans) {
                const taggedPorts = ciscoSGExpandPorts(eachVlan['tagged_ports']);
                for (let eachInterface of taggedPorts) {
                    if (eachInterface) {
                        if (!interfaceVlans[eachInterface]) {
                            interfaceVlans[eachInterface] = {
                                "tagged-vlans": [],
                                "untagged-vlans": []
                            }
                        }
                        interfaceVlans[eachInterface]['tagged-vlans'].push(eachVlan.vlan);
                    }
                }

                const unTaggedPorts = ciscoSGExpandPorts(eachVlan['untagged_ports']);
                for (let eachInterface of unTaggedPorts) {
                    if (eachInterface) {
                        if (!interfaceVlans[eachInterface]) {
                            interfaceVlans[eachInterface] = {
                                "tagged-vlans": [],
                                "untagged-vlans": []
                            }
                        }
                        interfaceVlans[eachInterface]['untagged-vlans'].push(eachVlan.vlan);
                    }
                }
            }
            // fetch the rest of the data via SNMP
            // const vlanPortMode = await ciscoSGSNMP.subtree({
            //     host: workerData.address,
            //     community: workerData.snmp_community,
            //     maxRepetitions: 1000,
            //     oid: "1.3.6.1.4.1.9.6.1.101.48.22.1.1"
            // });

            // const vlanNative = await ciscoSGSNMP.subtree({
            //     host: workerData.address,
            //     community: workerData.snmp_community,
            //     maxRepetitions: 1000,
            //     oid: "1.3.6.1.4.1.9.6.1.101.48.61.1.1"
            // });

            // const vlanTrunkMembers = await ciscoSGSNMP.subtree({
            //     host: workerData.address,
            //     community: workerData.snmp_community,
            //     maxRepetitions: 1000,
            //     oid: "1.3.6.1.4.1.9.6.1.101.48.61.1.2"
            // });

            // const vlanAccess = await ciscoSGSNMP.subtree({
            //     host: workerData.address,
            //     community: workerData.snmp_community,
            //     maxRepetitions: 1000,
            //     oid: "1.3.6.1.4.1.9.6.1.101.48.62.1.1"
            // });

            // rather frustratingly, we have to use the v1 method to get the vlan trunk members
            // const vlanTrunkMembers = {};
            // for (let eachVlan of vlanDocument.vlans) {
            //     const taggedResult = await ciscoSGSNMP.portlist({
            //         host: workerData.address,
            //         community: workerData.snmp_community,
            //         oid: `1.3.6.1.2.1.17.7.1.4.2.1.4.0.${eachVlan.id}`
            //     });
            //     for (let eachInterface of taggedResult) {
            //         if (eachInterface < 1000) {
            //             if (!vlanTrunkMembers[eachInterface]) {
            //                 vlanTrunkMembers[eachInterface] = []
            //             }
            //             vlanTrunkMembers[eachInterface].push(eachVlan.id);
            //         }
            //     }
            // }
            // console.log(vlanTrunkMembers);

            const interfaces = await interfacesCollection.find().toArray();

            // loop through each interface, fetching interface for each one
            for (let eachInterface of interfaces) {

                await interfacesCollection.updateOne(
                    { "interfaceId": eachInterface.interfaceId },
                    {
                        "$set": {
                            "tagged-vlans": interfaceVlans[eachInterface.shortId]["tagged-vlans"],
                            "untagged-vlans": interfaceVlans[eachInterface.shortId]["untagged-vlans"]
                        }
                    },
                    { upsert: false }
                );

            }

            // every 30 seconds
            await delay(30000);

        }
    }
}
