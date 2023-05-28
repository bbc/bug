"use strict";

const mongoSingle = require("@core/mongo-single");
const formatBps = require("@core/format-bps");
const mpegEncoderServiceGet = require("@services/mpegencoderservice-get");
const getConnectorIndex = require("@utils/connectorindex-get");

module.exports = async (panelId, serviceId) => {
    const statusBlocks = [];

    const sdiVideoModes = {
        SDI_OFF: "Off",
        SDI_480I: "480i50",
        SDI_480P: "480p25",
        SDI_576I: "576i50",
        SDI_576P: "576p25",
        SDI_720P24: "720p24",
        SDI_720P24_1001: "720p23",
        SDI_720P25: "720p25",
        SDI_720P30: "720p30",
        SDI_720P30_1001: "720p29",
        SDI_720P50: "720p50",
        SDI_720P60: "720p60",
        SDI_720P60_1001: "720p59",
        SDI_1080P24: "1080p24",
        SDI_1080P24_1001: "1080p23",
        SDI_1080P25: "1080p25",
        SDI_1080P30: "1080p30",
        SDI_1080P30_1001: "1080p29",
        SDI_1080I50: "1080i50",
        SDI_1080I60: "1080i60",
        SDI_1080I60_1001: "1080i59",
        SDI_1080P50: "1080p50",
        SDI_1080P60: "1080p60",
        SDI_1080P60_1001: "1080p59",
        SDI_2160P50: "2160p50",
        SDI_2160P60: "2160p60",
        SDI_2160P60_1001: "2160p59",
        ANY: "Any",
    };

    // get most of the things we need with this:
    const mpegEncoderService = await mpegEncoderServiceGet(serviceId, false);

    // then we just need the service status
    const serviceStatuses = await mongoSingle.get("mpegEncoderServiceStatus");
    const serviceStatus = serviceStatuses && serviceStatuses.find((s) => s.key === serviceId);

    if (!mpegEncoderService) {
        return [];
    }

    const serviceEnabled = mpegEncoderService?.encoderService.value?.enabled;

    const getResolution = () => {
        return [
            mpegEncoderService.videoProfile.value.resolution.vertical.split("_")[1],
            mpegEncoderService.videoProfile.value.resolution.scan === "INTERLACED" ? "i" : "p",
            mpegEncoderService.videoProfile.value.resolution.fps.split("_")[1],
        ].join("");
    };

    const connectorIndex = getConnectorIndex(mpegEncoderService?.encoderService);
    statusBlocks.push({
        image: `/container/${panelId}/thumb/${
            mpegEncoderService?.encoderService?.value?.slot
        }/${connectorIndex}?${new Date().getTime()}`,
    });

    //TODO make this work for Quad-link
    statusBlocks.push({
        label: "Input",
        state: serviceStatus?.value?.sdi[0]?.value?.videoLockInput ? "success" : "inactive",
        items: serviceStatus ? ["SDI", sdiVideoModes[serviceStatus.value.sdi[0]?.value.videoMode]] : ["Unknown"],
    });

    // encode format
    statusBlocks.push({
        label: "Format",
        state: serviceEnabled ? "success" : "inactive",
        items: [getResolution()],
    });

    // bit rate
    const videoBitrate = formatBps((mpegEncoderService.videoProfile?.value.bitrate / 1000000) * 1048576, 1, true);
    statusBlocks.push({
        label: "Video",
        state: serviceEnabled ? "success" : "inactive",
        items: [videoBitrate?.value, `\u00A0\u00A0\u00A0${videoBitrate?.label}\u00A0\u00A0\u00A0`],
    });

    // audio channels
    const audioCount = mpegEncoderService?.encoderService.value.audios.length;
    statusBlocks.push({
        label: "Audio",
        state: serviceEnabled ? "success" : "inactive",
        items: [audioCount, audioCount === 1 ? "CHANNEL" : "CHANNELS"],
    });

    for (const eachOutput of mpegEncoderService?.outputs) {
        if (eachOutput.value.transportSettings.udp.output.hasOwnProperty("cloned")) {
            statusBlocks.push({
                label: "Output",
                state: serviceEnabled && eachOutput.value.enabled ? "success" : "inactive",
                items: [
                    eachOutput.value.transportSettings.udp.output.cloned.a.destination.address,
                    eachOutput.value.transportSettings.udp.output.cloned.a.destination.port,
                    eachOutput.value.transportSettings.udp.output.cloned.b.destination.address,
                    eachOutput.value.transportSettings.udp.output.cloned.b.destination.port,
                ],
            });
        } else {
            statusBlocks.push({
                label: "Output",
                state: serviceEnabled && eachOutput.value.enabled ? "success" : "inactive",
                items: [
                    eachOutput.value.transportSettings.udp.settings.rtp ? "RTP" : "UDP",
                    eachOutput.value.transportSettings.udp.output.single.destination.address,
                    eachOutput.value.transportSettings.udp.output.single.destination.port,
                ],
            });
        }
    }
    return statusBlocks;
};
