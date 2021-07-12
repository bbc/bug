"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");

const register = require("module-alias/register");
const axios = require("../utils/axios");
const delay = require("delay");
const mongoDb = require("@core/mongo-db");

const updateDelay = 10000;

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["username", "password", "organisation", "encoders"],
});

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData?.id);
    const tokenCollection = await mongoDb.db.collection("token");
    const devicesCollection = await mongoDb.db.collection("devices");

    console.log(`links: teradek-core link worker starting...`);

    while (true) {
        const token = await tokenCollection.findOne();

        const response = await axios.get(`v1.0/${workerData.organisation}/pairs`, {
            params: {
                auth_token: token?.auth_token,
            },
        });

        if (response.data?.meta?.status === "ok") {
            for (let link of response.data?.response) {
                await devicesCollection.updateOne(
                    {
                        sid: link?.encoderSid,
                        type: "encoder",
                    },
                    { $set: { links: link } }
                );

                for (let decoder of link.linksToDecoders) {
                    await devicesCollection.updateOne(
                        {
                            sid: decoder?.sid,
                            type: "decoder",
                        },
                        { $set: { links: link } }
                    );
                }
            }
        } else {
            throw response.data;
        }

        await delay(updateDelay);
    }
};

main();
