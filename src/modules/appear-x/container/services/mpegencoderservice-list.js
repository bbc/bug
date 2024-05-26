"use strict";

const mongoSingle = require("@core/mongo-single");
const formatBitrate = require("@utils/format-bitrate");
const mpegEncodeVideoProfileList = require("@services/mpegencodevideoprofile-list");
const configGet = require("@core/config-get");
const getConnectorIndex = require("@utils/connectorindex-get");

module.exports = async (sortField = null, sortDirection = "asc", filters = {}) => {
    const config = await configGet();
    if (!config) {
        return null;
    }

    // fetch video profiles
    const mpegEncodeVideoProfiles = await mpegEncodeVideoProfileList();

    // fetch ip outputs
    const mpegIpOutputs = await mongoSingle.get("mpegIpOutputs");

    // fetch ip input services
    const mpegInputServices = await mongoSingle.get("mpegInputServices");

    const getChromaSampling = (value) => {
        try {
            const chars = value.split("_")[1].split("");
            return chars.join(":");
        } catch (error) {
            return null;
        }
    };

    const filterVideoProfile = (videoProfileId) => {
        const profile =
            mpegEncodeVideoProfiles && mpegEncodeVideoProfiles.find((profile) => profile.id === videoProfileId);
        if (profile) {
            return {
                label: profile?.label,
                bitDepth: profile?.bitDepth,
                latency: profile?.latency,
                codec: profile?.codec,
                bitrate: profile?.bitrate,
                bitrateText: formatBitrate(profile?.bitrate),
                chromaSampling: profile?.resolution?.chromaSampling,
                _chromaSampling: getChromaSampling(profile?.resolution?.chromaSampling),
                _resolution: profile._resolution,
            };
        }
        return null;
    };

    const mpegEncoderServices = await mongoSingle.get("mpegEncoderServices");
    return (
        mpegEncoderServices &&
        mpegEncoderServices
            .map((es) => {
                const connectorIndex = getConnectorIndex(es);

                // apparently this is the only way to do this. Eugh.
                const inputServiceKey = `${es?.value?.slot}:${connectorIndex}`;

                // check input services
                const matchingInputService =
                    mpegInputServices && mpegInputServices.find((is) => is.value.name === inputServiceKey);

                // check outputs
                let outputs = [];
                if (matchingInputService && mpegIpOutputs) {
                    for (let eachService of matchingInputService.value.sources) {
                        // find any IP outputs which have been created from this DVB service
                        let matchingOutputs = mpegIpOutputs.filter((ipo) => {
                            return (
                                ipo.value.outputSettings.tsWhitelistMode.dvbMode.source.multiplex[0].service.source ===
                                eachService.key
                            );
                        });
                        outputs = outputs.concat(matchingOutputs);
                    }
                }

                return {
                    id: es?.key,
                    label: es?.value?.label,
                    enabled: es?.value?.enabled,
                    sdiType: es?.value?.video?.source?.sdi?.sdiType.split("_")[1],
                    connector: es?.value?.video?.source?.sdi?.connectors.split("_")[1],
                    connectorIndex: connectorIndex,
                    inputServiceKey: inputServiceKey,
                    slot: es?.value?.slot,
                    slotPort: `${es?.value?.slot} / ${es?.value?.video?.source?.sdi?.connectors.split("_")[1]}`,
                    videoProfileId: es?.value?.video?.profile?.id,
                    videoProfile: filterVideoProfile(es?.value?.video?.profile?.id),
                    audios:
                        es?.value?.audios &&
                        es?.value?.audios?.map((audio) => {
                            return {
                                codec: audio?.main?.source?.embedded?.codec,
                                channel: audio?.main?.source?.embedded?.channel,
                                passthrough: audio?.main?.passthrough,
                                audioProfile: audio?.main?.profile?.id?.value,
                            };
                        }),
                    serviceName: es?.value?.output?.ts?.serviceName,
                    serviceProvider: es?.value?.output?.ts?.serviceProvider,
                    colorProfileId: es?.value?.color?.value?.profile?.id,
                    vancs:
                        es?.value?.vancs &&
                        es?.value?.vancs.map((vanc) => {
                            return vanc?.profile?.id;
                        }),
                    signalLoss: es?.value?.signalLoss,
                    lock: es?.value?.lock?.source === true,
                    additionalLatency: es?.value?.additionalLatency?.value,
                    testGeneratorProfileId: es?.value?.testGenerator?.value?.profile?.id,
                    testGeneratorEnabled: es?.value?.testGenerator?.value?.enable === true,
                    outputs: outputs
                        .filter((o) => o.value.enabled)
                        .map((o) => {
                            const returnedOutput = {
                                isRtp: o.value.transportSettings.udp.settings.rtp,
                                interfaces: [],
                            };
                            if ("cloned" in o.value.transportSettings.udp.output) {
                                returnedOutput.interfaces = [
                                    {
                                        interfaceId: o.value.transportSettings.udp.output.cloned.a.interfaceId,
                                        address: o.value.transportSettings.udp.output.cloned.a.destination.address,
                                        port: o.value.transportSettings.udp.output.cloned.a.destination.port,
                                        isRtp: o.value.transportSettings.udp.settings.rtp,
                                    },
                                    {
                                        interfaceId: o.value.transportSettings.udp.output.cloned.b.interfaceId,
                                        address: o.value.transportSettings.udp.output.cloned.b.destination.address,
                                        port: o.value.transportSettings.udp.output.cloned.b.destination.port,
                                        isRtp: o.value.transportSettings.udp.settings.rtp,
                                    },
                                ];
                            } else {
                                returnedOutput.interfaces = [
                                    {
                                        interfaceId: o.value.transportSettings.udp.output.single.interfaceId,
                                        address: o.value.transportSettings.udp.output.single.destination.address,
                                        port: o.value.transportSettings.udp.output.single.destination.port,
                                    },
                                ];
                            }
                            return returnedOutput;
                        }),
                    _protected: config?.protectedServices?.includes(es?.key),
                };
            })
            .sort((a, b) => a.slotPort.localeCompare(b.slotPort, "en", { sensitivity: "base" }))
    );
    return [];
};
