"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const register = require("module-alias/register");
const delay = require("delay");
const io = require("socket.io-client-2");
const mongoDb = require("@core/mongo-db");
const formatBps = require("@core/format-bps");

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
    delete stats?.qlen;
    delete stats?.aqlen;
    delete stats?.bitrate_out;
    delete stats?.ts;
    stats.timestamp = new Date();
    stats.value = stats.bitrate;
    delete stats?.bitrate;
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
            // <-- we don't use these historical stats at the moment - GH 21/10/2021
            // const entry = await devicesCollection.updateOne(
            //     {
            //         sid: encoderSid,
            //     },
            //     {
            //         $push: {
            //             encoderStatsAudio: {
            //                 $each: [{ ...stats }],
            //                 $slice: -20,
            //             },
            //         },
            //     }
            // );

            // and also update the audio level fields in the main object (easier to do this now)
            await devicesCollection.updateOne(
                {
                    sid: encoderSid,
                },
                {
                    $set: {
                        leftLevels: stats.leftLevels,
                        rightLevels: stats.rightLevels,
                    },
                }
            );

        });

        socket.on(`device:${encoderSid}:stats`, async (event) => {
            /* There are two types of result from this websocket - which look like this:
            {
                ts: 1634044347,
                num_conn: 1,
                cube_id: 10701957,
                bitrate: 412,
                bitrate_out: 176,
                qlen: 240,
                aqlen: 256,
                sess_duration: 14772,
                capabilities: 'E',
                is_decryption_key_ok: 1,
                sid: '10701957'
            }
            {
                ts: 1634044351,
                num_conn: 1,
                cube_id: 10701957,
                bitrate: 11,
                sess_duration: 437666,
                capabilities: 'C',
                is_decryption_key_ok: 1,
                sid: '10701957'
            }
            */
            // but the bitrates don't look right. So we only save when capabilities == "E"
            if (event.capabilities && event.capabilities === "E") {
                const stats = await filterStats(event);

                // push the stats into the array
                await devicesCollection.updateOne(
                    {
                        sid: encoderSid,
                    },
                    {
                        $push: {
                            encoderStatsVideo: {
                                $each: [{ ...stats }],
                                $slice: -60,
                            },
                        },
                    }
                );

                // and also update the bitrate field in the main object (easier to do this now)
                await devicesCollection.updateOne(
                    {
                        sid: encoderSid,
                    },
                    {
                        $set: {
                            bitrate: stats.value,
                            "bitrate-text": formatBps(parseInt(stats.value) * 1024)
                        },
                    }
                );
            }
        });
    }
};

main();
