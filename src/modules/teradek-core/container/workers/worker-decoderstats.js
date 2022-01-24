"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const register = require("module-alias/register");
const io = require("socket.io-client-2");
const mongoDb = require("@core/mongo-db");

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 60000,
    restartOn: ["username", "password", "organisation", "decoders"],
});

const filterStats = (stats) => {
    delete stats?.sid;
    delete stats?.decoder_video_frames_decoded;
    delete stats?.decoder_audio_frames_decoded;
    delete stats?.decoder_video_frame_height;
    delete stats?.decoder_video_frame_width;
    delete stats?.video_output_format;
    delete stats?.video_output_mode;
    delete stats?.decoder_audio_decode_errors;
    delete stats?.decoder_valid;
    delete stats?.decoder_video_decode_errors;
    delete stats?.ts;
    stats.timestamp = new Date();
    stats.value = stats?.decoder_vdec_framerate;
    delete stats?.decoder_vdec_framerate;
    return stats;
};

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData?.id);
    const tokenCollection = await mongoDb.db.collection("token");
    const devicesCollection = await mongoDb.db.collection("devices");

    console.log(`worker-decoderstats: starting to collect device stats starting...`);

    const token = await tokenCollection.findOne();

    const socket = io("https://io-core.teradek.com", {
        transports: ["websocket"],
        query: {
            cid: workerData?.organisation,
            auth_token: token?.auth_token,
        },
    });

    socket.on("connect_error", (event) => {
        console.log("worker-decoderstats: ", error);
    });

    socket.on("connect", () => {
        console.log(`decoders-stats: connected to teradek core ${socket.id}`);
    });

    for (let decoderSid of workerData?.decoders) {
        console.log(`worker-decoderstats: registering websocket listener for device sid ${decoderSid}`);

        socket.emit("room:enter", `device:${decoderSid}:decoder-stats`);
        // socket.emit("room:enter", `device:${decoder}:decoder-status`);

        socket.on(`device:${decoderSid}:decoder-stats`, async (event) => {
            if (event?.sid === decoderSid) {
                const stats = await filterStats(event);
                const entry = await devicesCollection.updateOne(
                    {
                        sid: decoderSid,
                    },
                    {
                        $push: {
                            decoderStats: {
                                $each: [{ ...stats }],
                                $slice: -30,
                            },
                        },
                    }
                );

                // and also update the framerate field in the main object (easier to do this now)
                await devicesCollection.updateOne(
                    {
                        sid: decoderSid,
                    },
                    {
                        $set: {
                            framerate: stats.value,
                            "framerate-text": `${Math.round(stats?.value * 100) / 100} fps`,
                        },
                    }
                );
            }
        });

        socket.on(`device:${decoderSid}:decoder-status`, async (event) => {
            const entry = await devicesCollection.updateOne(
                {
                    sid: decoderSid,
                },
                {
                    $set: {
                        decoderStatus: event?.status,
                    },
                }
            );
        });
    }
};

main();
