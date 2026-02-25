"use strict";

const mongoSaveArray = require("@core/mongo-savearray");
const logger = require("@core/logger")(module);
const mikrotikParseResults = require("@core/mikrotik-parseresults");

module.exports = async ({ routerOsApi, interfacesCollection }) => {

    try {
        const data = await routerOsApi.run("/interface/print");

        // process data
        const interfaces = [];
        for (let i in data) {
            interfaces.push(
                mikrotikParseResults({
                    result: data[i],
                    integerFields: ['mtu',
                        'actual-mtu',
                        'l2mtu',
                        'max-l2mtu',
                        'link-downs',
                        'rx-byte',
                        'tx-byte',
                        'rx-packet',
                        'tx-packet',
                        'rx-drop',
                        'tx-drop',
                        'tx-queue-drop',
                        'tx-error',
                        'rx-error',
                        'fp-rx-byte',
                        'fp-tx-byte',
                        'fp-rx-packet',
                        'fp-tx-packet'
                    ],
                    booleanFields: ['running',
                        'slave',
                        'disabled'
                    ],
                    timeFields: [],
                })
            );
        }

        logger.debug(`interfaces: found ${interfaces.length} interface(s) - saving to db`);
        await mongoSaveArray(interfacesCollection, interfaces, "id", true);
    } catch (error) {
        logger.error(`interfaces: ${error.message}`);
        throw error;
    }
};
