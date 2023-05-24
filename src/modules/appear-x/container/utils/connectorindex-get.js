"use strict";

module.exports = (service) => {
    try {
        const connector = service.value?.video?.source?.sdi?.connectors.split("_")[1];
        return ["1A", "1B", "1C", "1D", "2A", "2B", "2C", "2D"].indexOf(connector);
    } catch (error) {
        return null;
    }
};
