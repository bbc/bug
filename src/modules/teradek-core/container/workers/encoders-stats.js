"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const register = require("module-alias/register");
const delay = require("delay");
const io = require("socket.io-client-2");
const mongoDb = require("@core/mongo-db");

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 60000,
    restartOn: ["username", "password", "organisation", "encoders"],
});

const filterStats = async (stats) => {
    delete stats?.num_conn;
    delete stats?.cube_id;
    delete stats?.sess_duration;
    delete stats?.capabilities;
    delete stats?.is_decryption_key_ok;
    delete stats?.sid;
    stats.timestamp = new Date();
    delete stats?.ts;
    return stats;
};

const filterAudio = async (stats) => {
    const filteredStats = {
        timestamp: new Date(),
        leftLevels: stats?.audioLevelsDb[0],
        rightLevels: stats?.audioLevelsDb[1],
    };
    return filteredStats;
};

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData?.id);
    const tokenCollection = await mongoDb.db.collection("token");
    const devicesCollection = await mongoDb.db.collection("devices");

    console.log(`encoders-stats: starting to collect device stats starting...`);

    const token = await tokenCollection.findOne();

    const socket = io("https://io-core.teradek.com", {
        transports: ["websocket"],
        query: {
            cid: workerData?.organisation,
            auth_token: token?.auth_token,
        },
    });

    socket.on("connect_error", (event) => {
        console.log("encoder-stats: ", error);
    });

    socket.on("connect", () => {
        console.log(`encoders-stats: connected to teradek core ${socket.id}`);
    });

    for (let encoderSid of workerData.encoders) {
        console.log(`encoders-stats: registering websocket listener for device sid ${encoderSid}`);

        socket.emit("room:enter", `device:${encoderSid}:preview`);
        socket.emit("room:enter", `device:${encoderSid}:audio-preview`);
        socket.emit("room:enter", `device:${encoderSid}:stats`);

        socket.on(`device:${encoderSid}:preview`, async (event) => {
            if (event.status === "ok") {
                const entry = await devicesCollection.updateOne(
                    {
                        sid: encoderSid,
                    },
                    { $set: { thumbnail: event.img } }
                );
            }
        });

        socket.on(`device:${encoderSid}:audio-preview`, async (event) => {
            const stats = await filterAudio(event);
            const entry = await devicesCollection.updateOne(
                {
                    sid: encoderSid,
                },
                {
                    $push: {
                        encoderStatsAudio: {
                            $each: [{ ...stats }],
                            $slice: 20,
                        },
                    },
                }
            );
        });

        socket.on(`device:${encoderSid}:stats`, async (event) => {
            const stats = await filterStats(event);
            const entry = await devicesCollection.updateOne(
                {
                    sid: encoderSid,
                },
                {
                    $push: {
                        encoderStatsVideo: {
                            $each: [{ ...stats }],
                            $slice: 200,
                        },
                    },
                }
            );
        });
    }
};

main();
