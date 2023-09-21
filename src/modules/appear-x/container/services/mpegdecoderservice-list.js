"use strict";

const mongoSingle = require("@core/mongo-single");
const formatBitrate = require("@utils/format-bitrate");
const mpegDecodeVideoProfileList = require("@services/mpegdecodevideoprofile-list");
const configGet = require("@core/config-get");
const getConnectorIndex = require("@utils/connectorindex-get");

const parseZeroInt = (val) => {
    if (isNaN(val)) {
        return 0;
    }
    return parseInt(val);
};

const parseResolution = (es) => {
    // the Appear UI doesn't do this, it'll just show something like 0x0p50, but that's ugly
    if (!es?.hSize && !es?.vSize) {
        return null;
    }
    try {
        const scan = es?.scan?.value === "INTERLACED" ? "i" : "p";
        const fps = es?.framerate?.value.split("_")[1];
        return `${es?.hSize}x${es?.vSize}${scan}${fps}`;
    } catch (error) {
        return null;
    }
};

module.exports = async (sortField = null, sortDirection = "asc", filters = {}) => {
    const config = await configGet();
    if (!config) {
        return null;
    }

    // fetch video profiles
    const mpegDecodeVideoProfiles = await mpegDecodeVideoProfileList();

    // fetch ip inputs
    const ipInputs = await mongoSingle.get("ipInputs");

    // fetch ip input services
    const mpegInputServices = await mongoSingle.get("mpegInputServices");

    // fetch ip input status
    const ipInputStatuses = await mongoSingle.get("ipInputStatus");

    // fetch service status
    const decoderServiceStatuses = await mongoSingle.get("mpegDecoderServiceStatus");

    const filterVideoProfile = (videoProfileId) => {
        const profile =
            mpegDecodeVideoProfiles && mpegDecodeVideoProfiles.find((profile) => profile.id === videoProfileId);
        if (profile) {
            return {
                label: profile?.label,
                bitDepth: profile?.bitDepth,
                latency: profile?.latency,
                codec: profile?.codec,
                bitrate: profile?.bitrate,
                followInput: profile?.resolution.followInput,
                bitrateText: formatBitrate(profile?.bitrate),
                _resolution: profile._resolution,
            };
        }
        return null;
    };

    const mpegDecoderServices = await mongoSingle.get("mpegDecoderServices");

    return (
        mpegDecoderServices &&
        mpegDecoderServices
            .map((ds) => {
                // get connector index
                const connectorIndex = getConnectorIndex(ds);

                // check inputs
                const mpegIpInputKey = ds?.value?.video?.source?.ts?.sources[0]?.value;

                // check input services for a matching key
                const inputService = mpegInputServices.find((ips) => {
                    return ips?.value?.sources.find((s) => {
                        return s.key === mpegIpInputKey;
                    })
                        ? true
                        : false;
                });

                // this is what we've been after. The key - which is re-used in the GetInputs call and now gives us the ipInput
                const ipInput = ipInputs && ipInputs.find((ip) => ip?.key === inputService?.key);

                // we can also use it to get the input status
                const ipInputStatus = ipInputStatuses && ipInputStatuses.find((ips) => ips?.key === inputService?.key);

                // also the decoder service status
                const decoderServiceStatus =
                    decoderServiceStatuses && decoderServiceStatuses.find((dss) => dss.key === ds.key);

                const ipInputInterfaces = [];
                if ("seamless" in ipInput?.value?.transportSettings?.udp?.input) {
                    ipInputInterfaces.push({
                        interfaceId: ipInput?.value?.transportSettings.udp?.input?.seamless?.a?.interfaceId,
                        address: ipInput?.value?.transportSettings?.udp?.input?.seamless?.a?.destination?.address,
                        port: ipInput?.value?.transportSettings?.udp?.input?.seamless?.a?.destination?.port,
                        hasFec: ipInput?.value?.transportSettings?.udp?.input?.seamless?.a?.fec,
                        isRtp: ipInput?.value?.transportSettings?.udp?.input?.seamless?.a?.rtp,
                    });
                    ipInputInterfaces.push({
                        interfaceId: ipInput?.value?.transportSettings?.udp?.input?.seamless?.b?.interfaceId,
                        address: ipInput?.value?.transportSettings?.udp?.input?.seamless?.b?.destination?.address,
                        port: ipInput?.value?.transportSettings?.udp?.input?.seamless?.b?.destination?.port,
                        hasFec: ipInput?.value?.transportSettings?.udp?.input?.seamless?.b?.fec,
                        isRtp: ipInput?.value?.transportSettings?.udp?.input?.seamless?.b?.rtp,
                    });
                } else {
                    ipInputInterfaces.push({
                        interfaceId: ipInput?.value?.transportSettings?.udp?.input?.single?.interfaceId,
                        address: ipInput?.value?.transportSettings?.udp?.input?.single?.destination?.address,
                        port: ipInput?.value?.transportSettings?.udp?.input?.single?.destination?.port,
                        hasFec: ipInput?.value?.transportSettings?.udp?.input?.single?.fec,
                        isRtp: ipInput?.value?.transportSettings?.udp?.input?.single?.rtp,
                    });
                }

                return {
                    id: ds?.key,
                    label: ds?.value?.label,
                    enabled: ds?.value?.enabled,
                    sdiType: ds?.value?.video?.destination?.sdi?.sdiType.split("_")[1],
                    connector: ds?.value?.video?.destination?.sdi?.connectors.split("_")[1],
                    connectorIndex: connectorIndex,
                    inputServiceKey: inputService?.key,
                    slot: ds?.value?.slot,
                    slotPort: `${ds?.value?.slot} / ${ds?.value?.video?.destination?.sdi?.connectors.split("_")[1]}`,
                    videoProfileId: ds?.value?.video?.profile?.id,
                    videoProfile: filterVideoProfile(ds?.value?.video?.profile?.id),
                    audios:
                        ds?.value?.audios &&
                        ds?.value?.audios?.map((audio) => {
                            return {
                                passthrough: audio?.main?.passthrough,
                                channel: audio?.main?.destination?.embedded?.channel,
                                codec: audio?.main?.destination?.embedded?.codec,
                            };
                        }),
                    input: {
                        label: ipInput?.value?.label,
                        enabled: ipInput?.value?.enabled,
                        interfaces: ipInputInterfaces,
                        dejitterBuffer: ipInput?.value?.analyzeMode?.value?.dvbMode?.dejitter?.value?.bufferSize,
                    },
                    inputStatus: {
                        hasBitrate: ipInputStatus?.value?.hasBitrate,
                        rtpErrors: ipInputStatus?.value?.rtpErrors?.value,
                        ccErrors: ipInputStatus?.value?.ccErrors?.value,
                        serviceName: ipInputStatus?.value?.services.map((s) => s.name).join(" / "),
                        fecStatus: {
                            fecReceived: ipInputStatus?.value?.fecStatus?.value?.recived ?? false,
                            fecEnabled: ipInputStatus?.value?.fecStatus?.value?.enabled ?? false,
                            fecType: ipInputStatus?.value?.fecStatus?.value?.fecType ?? "",
                            fecColumns: ipInputStatus?.value?.fecStatus?.value?.columns ?? 0,
                            fecRows: ipInputStatus?.value?.fecStatus?.value?.rows ?? 0,
                        },
                        seamlessStatus: ipInputStatus?.value?.seamlessStatus?.value?.synchronized ?? false,
                        seamlessInterfaces: [
                            {
                                bitrate: parseZeroInt(
                                    ipInputStatus?.value?.seamlessStatus?.value?.portA?.value?.bitrate
                                ),
                                _bitrateText: formatBitrate(
                                    parseZeroInt(ipInputStatus?.value?.seamlessStatus?.value?.portA?.value?.bitrate)
                                ),
                                sequenceErrors: parseZeroInt(
                                    ipInputStatus?.value?.seamlessStatus?.value?.portA?.value?.sequenceErrors
                                ),
                                address:
                                    ipInputStatus?.value?.ipSourceAddressStatus?.seamless?.a?.value?.sourceIpAddress,
                            },
                            {
                                bitrate: parseZeroInt(
                                    ipInputStatus?.value?.seamlessStatus?.value?.portB?.value?.bitrate
                                ),
                                _bitrateText: formatBitrate(
                                    parseZeroInt(ipInputStatus?.value?.seamlessStatus?.value?.portB?.value?.bitrate)
                                ),
                                sequenceErrors: parseZeroInt(
                                    ipInputStatus?.value?.seamlessStatus?.value?.portB?.value?.sequenceErrors
                                ),
                                address:
                                    ipInputStatus?.value?.ipSourceAddressStatus?.seamless?.b?.value?.sourceIpAddress,
                            },
                        ],
                        bitrates: {
                            totalFlowBitrate: parseZeroInt(ipInputStatus?.value?.bitrates?.value?.totalFlowBitrate),
                            _totalFlowBitrateText: formatBitrate(
                                parseZeroInt(ipInputStatus?.value?.bitrates?.value?.totalFlowBitrate)
                            ),
                            totalFlowWithoutFecBitrate: parseZeroInt(
                                ipInputStatus?.value?.bitrates?.value?.totalFlowWithoutFecBitrate
                            ),
                        },
                        dejitterStatus: {
                            mode: ipInputStatus?.value?.dejitterStatus?.value?.mode,
                            maxJitter: ipInputStatus?.value?.dejitterStatus?.value?.maxJitter,
                            minDelay: ipInputStatus?.value?.dejitterStatus?.value?.minDelay,
                        },
                    },

                    serviceStatus: {
                        bitRate: parseZeroInt(decoderServiceStatus?.value?.video?.value?.input?.input?.ts?.bitRate),
                        _bitrateText: formatBitrate(
                            parseZeroInt(decoderServiceStatus?.value?.video?.value?.input?.input?.ts?.bitRate)
                        ),
                        ccError: parseInt(decoderServiceStatus?.value?.video?.value?.input?.input?.ts?.ccError),
                        valid: decoderServiceStatus?.value?.video?.value?.input?.input?.ts?.es?.valid,
                        _resolution: parseResolution(decoderServiceStatus?.value?.video?.value?.input?.input?.ts?.es),
                        codec: decoderServiceStatus?.value?.video?.value?.input?.input?.ts?.es?.codec,
                        bitDepth: decoderServiceStatus?.value?.video?.value?.input?.input?.ts?.es?.bitDepth,
                        chroma: decoderServiceStatus?.value?.video?.value?.input?.input?.ts?.es?.chroma,
                    },
                    // signalLoss: ds?.value?.signalLoss,
                    // lock: ds?.value?.lock?.source === true,
                    _protected: config?.protectedServices?.includes(ds?.key),
                };
            })
            .sort((a, b) => a.slotPort.localeCompare(b.slotPort, "en", { sensitivity: "base" }))
    );
    return [];
};
