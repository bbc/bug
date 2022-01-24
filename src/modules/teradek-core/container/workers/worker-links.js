"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");

const register = require("module-alias/register");
const axios = require("../utils/axios");
const delay = require("delay");
const mongoDb = require("@core/mongo-db");
const mongoCreateIndex = require("@core/mongo-createindex");
const mongoCollection = require("@core/mongo-collection");
const mongoSaveArray = require("@core/mongo-savearray");

const updateDelay = 60000;

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["username", "password", "organisation", "encoders"],
});

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData?.id);

    const tokenCollection = await mongoCollection("token");
    const devicesCollection = await mongoCollection("devices");
    const linksCollection = await mongoCollection("links");

    // and now create the index with ttl
    await mongoCreateIndex(linksCollection, "timestamp", { expireAfterSeconds: 120 });

    console.log(`worker-links: teradek-core link worker starting...`);

    // initial delay (to stagger device polls)
    await delay(12000);

    while (true) {
        const token = await tokenCollection.findOne();

        const response = await axios.get(`v1.0/${workerData.organisation}/pairs`, {
            params: {
                auth_token: token?.auth_token,
            },
        });

        if (response.data?.meta?.status === "ok") {
            // update devices first
            for (let link of response.data?.response) {
                const result = await devicesCollection.updateOne(
                    {
                        sid: link?.encoderSid,
                        type: "encoder",
                    },
                    { $set: { links: link } }
                );

                // make filtered copy of link
                const filteredLink = {
                    id: link.id,
                    encoderSid: link.encoderSid,
                };

                for (let decoder of link.linksToDecoders) {
                    await devicesCollection.updateOne(
                        {
                            sid: decoder?.sid,
                            type: "decoder",
                        },
                        { $set: { link: filteredLink } }
                    );
                }
            }

            // and add to the links collection
            await mongoSaveArray(linksCollection, response.data?.response, "id");
        } else {
            throw response.data;
        }

        await delay(updateDelay);
    }
};

main();
