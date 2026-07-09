"use strict";

const mongoSingle = require("@core/mongo-single");
const configGet = require("@core/config-get");
const logger = require("@core/logger")(module);
const magewellEncodeSdi = require("@utils/magewell-encode-sdi");
const deepMerge = require("@utils/deep-merge");
const { buildVideoPayload } = require("@utils/video-payload");
const {
    buildStreamServerPayload,
    hasStreamServerPayloadChanged,
} = require("@utils/stream-server-payload");
const codecdataGet = require("@services/codecdata-get");

const getServerIds = (servers) => {
    return new Set(
        (Array.isArray(servers) ? servers : [])
            .map((server) => server?.id)
            .filter((id) => id !== undefined)
    );
};

module.exports = async () => {
    const config = await configGet();
    if (!config) {
        throw new Error("Missing module config");
    }

    const localdata = (await mongoSingle.get("localdata")) || {};

    if (Object.keys(localdata).length === 0) {
        return true;
    }

    const codecData = await codecdataGet();
    const savedSettings = (await mongoSingle.get("settings")) || {};
    const pendingLocaldata = { ...localdata };

    const updateClient = async (command, data) => {
        const result = await magewellClient.request(command, data);
        if (!result || result.ok !== true) {
            throw new Error(`failed to save ${command} data: ${JSON.stringify(data)}, result: ${JSON.stringify(result)}`);
        }
        logger.info(`saved ${command} settings: ${JSON.stringify(data)}`);
    };

    const clearLocaldataKeys = async (keys) => {
        let hasChanged = false;

        for (const key of keys) {
            if (Object.prototype.hasOwnProperty.call(pendingLocaldata, key)) {
                delete pendingLocaldata[key];
                hasChanged = true;
            }
        }

        if (hasChanged) {
            await mongoSingle.set("localdata", pendingLocaldata);
        }
    };

    const magewellClient = magewellEncodeSdi.createClient({
        address: config.address,
        username: config.username,
        password: config.password,
        apiPath: "/usapi",
        codeField: "result",
        autoLogin: false,
    });

    try {
        await magewellClient.login();

        const mergedSettings = deepMerge(codecData, localdata);

        // use no signal files
        if (localdata["use-nosignal-file"] !== undefined) {
            await updateClient("use-nosignal-file", {
                "use-nosignal-file": localdata["use-nosignal-file"],
            });
            await clearLocaldataKeys(["use-nosignal-file"]);
        }

        // no signal files
        if (localdata["no-signal-file"]) {
            await updateClient("set-nosignal-file", {
                "no-signal-file": localdata["no-signal-file"],
            });
            await clearLocaldataKeys(["no-signal-file"]);
        }

        // deinterlace settings
        if (["enable-deinterlace", "deinterlace-mode"].some((key) => Object.prototype.hasOwnProperty.call(localdata, key))) {
            await updateClient("enable-deinterlace", {
                "enable-deinterlace": mergedSettings["enable-deinterlace"],
                "deinterlace-mode": mergedSettings["deinterlace-mode"],
            });
            await clearLocaldataKeys(["enable-deinterlace", "deinterlace-mode"]);
        }

        // main encode settings
        if (localdata["main-stream"] !== undefined) {
            await updateClient("set-video", buildVideoPayload(mergedSettings["main-stream"], 0));
            await clearLocaldataKeys(["main-stream"]);
        }

        // sub encode settings
        if (localdata["sub-stream"] !== undefined) {
            const wasEnabled = savedSettings["sub-stream"]?.enable;
            const isEnabled = mergedSettings["sub-stream"]?.enable;

            if (isEnabled && !wasEnabled) {
                // enable only: no need to send sub-stream video settings as the controls are disabled
                await updateClient("set-enable-stream1", { enable: 1 });
            }
            else if (!isEnabled && wasEnabled) {
                // disable path requires sending video settings first, then turning stream off
                await updateClient("set-video", buildVideoPayload(mergedSettings["sub-stream"], 1));
                await updateClient("set-enable-stream1", { enable: 0 });
            }
            else if (isEnabled) {
                // still enabled: apply updated sub-stream video settings
                await updateClient("set-video", buildVideoPayload(mergedSettings["sub-stream"], 1));
            }

            await clearLocaldataKeys(["sub-stream"]);
        }

        // audio
        if (localdata["audio"] !== undefined) {
            const audioPayload = {
                stream: 0,
                "sample-rate": mergedSettings.audio["sample-rate"],
                channels: mergedSettings.audio.channels,
                kbps: mergedSettings.audio.kbps,
                "use-lfe": mergedSettings.audio["use-lfe"],
            };

            for (let i = 0; i < 8; i++) {
                audioPayload[`ch${i}`] = mergedSettings.audio[`ch${i}`];
            }
            await updateClient("set-audio", audioPayload);
            await clearLocaldataKeys(["audio"]);
        }

        // outputs
        if (localdata["stream-server"] !== undefined) {
            const previousStreamServers = Array.isArray(savedSettings["stream-server"]) ? savedSettings["stream-server"] : [];
            const streamServers = Array.isArray(mergedSettings["stream-server"]) ? mergedSettings["stream-server"] : [];
            const currentServerIds = getServerIds(streamServers);
            const hadAnyEnabledServer = previousStreamServers.some((server) => server?.["is-use"] === 1);
            const hasAnyEnabledServer = streamServers.some((server) => server?.["is-use"] === 1);
            const previousServerById = new Map(
                previousStreamServers
                    .map((server) => [server?.id, server])
                    .filter(([id]) => id !== undefined)
            );
            const previousPayloadById = new Map(
                previousStreamServers
                    .map((server) => [server?.id, buildStreamServerPayload(server)])
                    .filter(([id]) => id !== undefined)
            );

            // check for deleted servers
            for (const previousStreamServer of previousStreamServers) {
                if (previousStreamServer?.id === undefined || currentServerIds.has(previousStreamServer.id)) {
                    continue;
                }

                // server was deleted, so we need to remove it from the device
                await updateClient("del-server", {
                    id: previousStreamServer.id,
                });
            }

            for (const streamServer of streamServers) {
                const previousServer = previousServerById.get(streamServer?.id);
                const nextPayload = buildStreamServerPayload(streamServer);
                const previousPayload = previousPayloadById.get(streamServer?.id);

                if (previousServer === undefined) {
                    await updateClient("add-server", nextPayload);
                    if (streamServer?.["is-use"] === 1) {
                        await updateClient("enable-server", {
                            id: streamServer.id,
                            "is-use": streamServer["is-use"],
                        });
                    }
                    continue;
                }

                const streamServerPayloadChanged = hasStreamServerPayloadChanged(previousPayload, nextPayload);
                const hasEnableChanged = previousServer?.["is-use"] !== streamServer?.["is-use"];

                if (!streamServerPayloadChanged && !hasEnableChanged) {
                    continue;
                }

                if (streamServerPayloadChanged) {
                    await updateClient("set-server", nextPayload);
                }

                if (hasEnableChanged) {
                    await updateClient("enable-server", {
                        id: streamServer.id,
                        "is-use": streamServer["is-use"],
                    });
                }
            }

            if (!hadAnyEnabledServer && hasAnyEnabledServer) {
                await updateClient("start-live", {});
            }

            await clearLocaldataKeys(["stream-server"]);
        }

        await mongoSingle.set("settings", mergedSettings);

        await magewellClient.logout();

        return true;
    } catch (error) {
        logger.error(`device save failed`);
        throw error;
    }
};