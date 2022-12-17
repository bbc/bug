const getSystem = () => {
    return {
        [`1.3.6.1.4.1.34946.5.2.1.0`]: "systemName",
        [`1.3.6.1.4.1.34946.5.2.2.0`]: "systemLocation",
        [`1.3.6.1.4.1.34946.5.2.3.0`]: "systemNotes",
    };
};

const getDevice = (deviceIndex) => {
    return {
        [`1.3.6.1.4.1.34946.5.3.${deviceIndex}.1.2.0`]: "deviceType",
        [`1.3.6.1.4.1.34946.5.3.${deviceIndex}.1.3.0`]: "deviceName",
        [`1.3.6.1.4.1.34946.5.3.${deviceIndex}.1.4.0`]: "deviceLocation",
        [`1.3.6.1.4.1.34946.5.3.${deviceIndex}.1.5.0`]: "deviceNotes",
        [`1.3.6.1.4.1.34946.5.3.${deviceIndex}.1.6.0`]: "deviceHasChangeover",
    };
};

const getOutput = (deviceIndex, outputIndex) => {
    return {
        [`1.3.6.1.4.1.34946.5.3.${deviceIndex}.2.${outputIndex}.1.0`]: "outputState",
        [`1.3.6.1.4.1.34946.5.3.${deviceIndex}.2.${outputIndex}.2.0`]: "outputName",
    };
};

const getMeter = (deviceIndex, meterIndex) => {
    return {
        [`1.3.6.1.4.1.34946.5.3.${deviceIndex}.3.${meterIndex}.2.0`]: "meterName",
        [`1.3.6.1.4.1.34946.5.3.${deviceIndex}.3.${meterIndex}.3.0`]: "meterAmps",
        [`1.3.6.1.4.1.34946.5.3.${deviceIndex}.3.${meterIndex}.4.0`]: "meterVolts",
        [`1.3.6.1.4.1.34946.5.3.${deviceIndex}.3.${meterIndex}.5.0`]: "meterWatts",
        [`1.3.6.1.4.1.34946.5.3.${deviceIndex}.3.${meterIndex}.6.0`]: "meterVA",
        [`1.3.6.1.4.1.34946.5.3.${deviceIndex}.3.${meterIndex}.7.0`]: "meterPowerFactor",
        [`1.3.6.1.4.1.34946.5.3.${deviceIndex}.3.${meterIndex}.8.0`]: "meterFrequency",
    };
};

module.exports = {
    getSystem: getSystem,
    getDevice: getDevice,
    getOutput: getOutput,
    getMeter: getMeter,
};
