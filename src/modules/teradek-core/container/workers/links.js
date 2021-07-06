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

        for (let encoder of workerData.encoders) {
            const response = await axios.get(`v1.0/${workerData.organisation}/pairs`, {
                params: {
                    auth_token: token?.auth_token,
                    encoderSid: encoder?.sid,
                },
            });

            if (response.data?.meta?.status === "ok") {
                const data = response.data?.response[0];
                await devicesCollection.updateOne(
                    {
                        sid: data?.encoderSid,
                    },
                    { $set: { links: data } }
                );
            } else {
                throw response.data;
            }
        }
        await delay(updateDelay);
    }
};

main();
