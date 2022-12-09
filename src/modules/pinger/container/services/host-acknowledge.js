"use strict";

const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");
const { IncomingWebhook } = require("@slack/webhook");

const bugHost = process.env.BUG_HOST || "127.0.0.1";
const bugPort = process.env.BUG_PORT || "80";

module.exports = async (hostId) => {
    const config = await configGet();
    const hostsCollection = await mongoCollection("hosts");

    if (config && config.hosts[hostId]) {
        //Update database entry
        const query = { hostId: hostId };
        const update = {
            $set: {
                timestamp: new Date(),
                acknowledged: true,
            },
        };
        const options = { upsert: true };

        if (config?.webhook) {
            const webhook = new IncomingWebhook(config?.webhook);

            webhook.send({
                attachments: [
                    {
                        title: `:large_blue_circle: ${config?.hosts[hostId]?.title}`,
                        text: `<http://${bugHost}:${bugPort}/panel/${config?.id}/host/${hostId}|${config?.hosts[hostId]?.host}> has been acknowledged.`,
                        color: `#2196f3`,
                    },
                ],
            });
        }

        return await hostsCollection.updateOne(query, update, options);
    }

    return false;
};
