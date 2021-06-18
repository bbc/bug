"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");

const register = require("module-alias/register");
const delay = require("delay");
const io = require("socket.io-client-2");
const mongoDb = require("@core/mongo-db");

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 60000,
    restartOn: ["username", "password", "organisation"],
});

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData?.id);
    const tokenCollection = await mongoDb.db.collection("token");
    const devicesCollection = await mongoDb.db.collection("devices");
    const decoders = await devicesCollection
        .find({ type: "decoder" })
        .toArray();

    console.log(`decoders-stats: starting to collect device stats starting...`);

    const token = await tokenCollection.findOne();

    const socket = io("https://io-core.teradek.com", {
        transports: ["websocket"],
        query: {
            cid: workerData?.organisation,
            auth_token: token?.auth_token,
        },
    });

    socket.on("connect_error", (event) => {
        console.log("decoder-stats: ", error);
    });

    socket.on("connect", () => {
        console.log(`decoders-stats: conencted to teradek core ${socket.id}`);
    });

    for (let decoder of decoders) {
        if (decoder?.type === "decoder") {
            socket.emit("room:enter", `device:${decoder.sid}:decoder-stats`);
            socket.emit("room:enter", `device:${decoder.sid}:decoder-status`);

            socket.on(`device:${decoder.sid}:decoder-stats`, async (event) => {
                if (event?.sid === decoder.sid) {
                    const entry = await devicesCollection.updateOne(
                        {
                            sid: event.sid,
                        },
                        {
                            $push: {
                                history_stats: {
                                    $each: [
                                        {
                                            ...event,
                                            timestamp: Date.now(),
                                        },
                                    ],
                                    $slice: 100,
                                },
                            },
                        }
                    );
                }
            });

            socket.on(`device:${decoder.sid}:decoder-status`, async (event) => {
                const entry = await devicesCollection.updateOne(
                    {
                        sid: decoder.sid,
                    },
                    {
                        $push: {
                            history_status: {
                                $each: [{ ...event, timestamp: Date.now() }],
                                $slice: 100,
                            },
                        },
                    }
                );
            });
        }
    }
};

main();
