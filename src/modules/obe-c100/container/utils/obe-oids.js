const getDevice = (encoderIndex) => {
    return {
        [`1.3.6.1.4.1.40562.3.2.4.1.1.2.${encoderIndex}`]: "obeEncoderName",
        [`1.3.6.1.4.1.40562.3.2.4.1.1.3.${encoderIndex}`]: "obeEncoderAutoStart",
        [`1.3.6.1.4.1.40562.3.2.4.1.1.4.${encoderIndex}`]: "obeEncoderRowStatus",
        [`1.3.6.1.4.1.40562.3.2.5.1.1.1.${encoderIndex}`]: "inputDeviceType",
        [`1.3.6.1.4.1.40562.3.2.5.1.1.2.${encoderIndex}`]: "inputCardidx",
        [`1.3.6.1.4.1.40562.3.2.5.1.1.3.${encoderIndex}`]: "inputVideoFormat",
        [`1.3.6.1.4.1.40562.3.2.5.1.1.4.${encoderIndex}`]: "inputStatus",
        [`1.3.6.1.4.1.40562.3.2.5.1.1.6.${encoderIndex}`]: "inputPictureOnSignalLoss",
        [`1.3.6.1.4.1.40562.3.2.5.1.1.7.${encoderIndex}`]: "inputBarsLine1",
        [`1.3.6.1.4.1.40562.3.2.5.1.1.8.${encoderIndex}`]: "inputBarsLine2",
        [`1.3.6.1.4.1.40562.3.2.5.1.1.9.${encoderIndex}`]: "inputBarsLine3",
        [`1.3.6.1.4.1.40562.3.2.5.1.1.10.${encoderIndex}`]: "inputBarsLine4",
        [`1.3.6.1.4.1.40562.3.2.5.1.1.38.${encoderIndex}`]: "inputClapper",
        [`1.3.6.1.4.1.40562.3.2.5.1.1.39.${encoderIndex}`]: "inputClapperInterval",
        [`1.3.6.1.4.1.40562.3.2.5.1.1.12.${encoderIndex}`]: "inputSDDownscale",
        [`1.3.6.1.4.1.40562.3.2.6.1.1.1.${encoderIndex}`]: "videoAvcProfile",
        [`1.3.6.1.4.1.40562.3.2.6.1.1.2.${encoderIndex}`]: "videoBitrate",
        [`1.3.6.1.4.1.40562.3.2.6.1.1.3.${encoderIndex}`]: "videoBufferSize",
        [`1.3.6.1.4.1.40562.3.2.6.1.1.4.${encoderIndex}`]: "videoKeyframeInterval",
        [`1.3.6.1.4.1.40562.3.2.6.1.1.5.${encoderIndex}`]: "videoBFrames",
        [`1.3.6.1.4.1.40562.3.2.6.1.1.14.${encoderIndex}`]: "videoLatency",
        [`1.3.6.1.4.1.40562.3.2.6.1.1.15.${encoderIndex}`]: "videoRowStatus",
        [`1.3.6.1.4.1.40562.3.2.9.1.1.1.${encoderIndex}`]: "muxRate",
        [`1.3.6.1.4.1.40562.3.2.9.1.1.10.${encoderIndex}`]: "muxDvbServiceName",
        [`1.3.6.1.4.1.40562.3.2.9.1.1.11.${encoderIndex}`]: "muxDvbProviderName",
    };
};

const getAudio = (encoderIndex, audioIndex) => {
    return {
        [`1.3.6.1.4.1.40562.3.2.7.1.1.2.${encoderIndex}.${audioIndex}`]: "audioFormat",
        [`1.3.6.1.4.1.40562.3.2.7.1.1.3.${encoderIndex}.${audioIndex}`]: "audioChannelMap",
        [`1.3.6.1.4.1.40562.3.2.7.1.1.4.${encoderIndex}.${audioIndex}`]: "audioBitrate",
        [`1.3.6.1.4.1.40562.3.2.7.1.1.5.${encoderIndex}.${audioIndex}`]: "audioSdiPair",
        [`1.3.6.1.4.1.40562.3.2.7.1.1.7.${encoderIndex}.${audioIndex}`]: "audioMp2Mode",
        [`1.3.6.1.4.1.40562.3.2.7.1.1.10.${encoderIndex}.${audioIndex}`]: "audioPid",
    };
};

const getOutput = (encoderIndex, outputIndex) => {
    return {
        [`1.3.6.1.4.1.40562.3.2.10.1.1.2.${encoderIndex}.${outputIndex}`]: "outputMethod",
        [`1.3.6.1.4.1.40562.3.2.10.1.1.4.${encoderIndex}.${outputIndex}`]: "outputIP",
        [`1.3.6.1.4.1.40562.3.2.10.1.1.5.${encoderIndex}.${outputIndex}`]: "outputPort",
        [`1.3.6.1.4.1.40562.3.2.10.1.1.6.${encoderIndex}.${outputIndex}`]: "outputTTL",
        [`1.3.6.1.4.1.40562.3.2.10.1.1.7.${encoderIndex}.${outputIndex}`]: "outputTOS",
        [`1.3.6.1.4.1.40562.3.2.10.1.1.9.${encoderIndex}.${outputIndex}`]: "outputFecType",
        [`1.3.6.1.4.1.40562.3.2.10.1.1.10.${encoderIndex}.${outputIndex}`]: "outputFecColumns",
        [`1.3.6.1.4.1.40562.3.2.10.1.1.11.${encoderIndex}.${outputIndex}`]: "outputFecRows",
        [`1.3.6.1.4.1.40562.3.2.10.1.1.13.${encoderIndex}.${outputIndex}`]: "outputDupDelay",
        [`1.3.6.1.4.1.40562.3.2.10.1.1.14.${encoderIndex}.${outputIndex}`]: "outputARQBuffer",
    };
};

module.exports = {
    getDevice: getDevice,
    getAudio: getAudio,
    getOutput: getOutput,
};
