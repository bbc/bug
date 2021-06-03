"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");

const register = require("module-alias/register");
const delay = require("delay");
const io = require("socket.io-client-2");
const mongoDb = require("@core/mongo-db");

const config = workerData.config;
const errorDelayMs = 60000;
let delayMs = 10000;

// Tell the manager the things you care about
parentPort.postMessage({
    index: workerData.index,
    restartOn: ["username", "password", "organisation"],
});

const pollDevice = async () => {
    const tokenCollection = await mongoDb.db.collection("token");
    const token = await tokenCollection.findOne();

    const devicesCollection = await mongoDb.db.collection("devices");
    const encoders = await devicesCollection
        .find({ type: "encoder" })
        .toArray();

    console.log(`encoders-stats: starting to collect device stats starting...`);

    // initial delay (to stagger device polls)
    await delay(1000);

    try {
        const socket = io("https://io-core.teradek.com", {
            transports: ["websocket"],
            query: {
                cid: config?.organisation,
                auth_token: token?.auth_token,
            },
        });

        socket.on("connect_error", (event) => {
            console.log("encoder-stats: ", error);
        });

        socket.on("connect", () => {
            console.log(
                `encoders-stats: conencted to teradek core ${socket.id}`
            );
        });

        for (let encoder of encoders) {
            if (encoder?.type === "encoder") {
                socket.emit("room:enter", `device:${encoder.sid}:preview`);
                socket.emit(
                    "room:enter",
                    `device:${encoder.sid}:audio-preview`
                );

                socket.on(`device:${encoder.sid}:preview`, async (event) => {
                    if (event.status === "ok") {
                        const entry = await devicesCollection.updateOne(
                            {
                                sid: encoder.sid,
                            },
                            { $set: { thumbnail: event.img } }
                        );
                    }
                });

                socket.on(
                    `device:${encoder.sid}:audio-preview`,
                    async (event) => {
                        const entry = await devicesCollection.updateOne(
                            {
                                sid: encoder.sid,
                            },
                            {
                                $push: {
                                    audio_preview: {
                                        $each: [
                                            { ...event, timestamp: Date.now() },
                                        ],
                                        $slice: 20,
                                    },
                                },
                            }
                        );
                    }
                );
            }
        }
    } catch (error) {
        console.log("encoder-stats: ", error);
        noErrors = false;
    }
};

const main = async () => {
    // Connect to the db
    await mongoDb.connect(config?.id);
    // Kick things off
    while (true) {
        try {
            await pollDevice();
        } catch (error) {
            console.log("encoder-stats: ", error);
        }
        await delay(errorDelayMs);
    }
};

main();
