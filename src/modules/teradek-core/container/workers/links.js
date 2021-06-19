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
    restartOn: ["username", "password", "organisation"],
});

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData?.id);
    const tokenCollection = await mongoDb.db.collection("token");
    const devicesCollection = await mongoDb.db.collection("devices");
    const linksCollection = await mongoDb.db.collection("links");

    console.log(`links: teradek-core encoder worker starting...`);

    while (true) {
        const token = await tokenCollection.findOne();
        const encoders = await devicesCollection
            .find({ type: "encoder" })
            .toArray();

        for (let encoder of encoders) {
            const response = await axios.get(
                `v1.0/${workerData.organisation}/pairs`,
                {
                    params: {
                        auth_token: token?.auth_token,
                        encoderSid: encoder.sid,
                    },
                }
            );

            if (response.data?.meta?.status === "ok") {
                const data = response.data?.response[0];
                const query = { encoderSid: data?.encoderSid };
                await linksCollection.replaceOne(query, data, { upsert: true });
            } else {
                throw response.data;
            }
        }
        await delay(updateDelay);
    }
};

main();
