"use strict";

module.exports = (service) => {
    try {
        let connector = null;

        // try encode
        connector = service?.value?.video?.source?.sdi?.connectors.split("_")[1];

        // try decode
        if (!connector) {
            connector = service?.value?.video?.destination?.sdi?.connectors.split("_")[1];
        }

        const connectors = {
            "1A": 0,
            "1B": 1,
            "1C": 2,
            "1D": 3,
            "2A": 4,
            "2B": 5,
            "2C": 6,
            "2D": 7,
            "1AC": 0,
            "1BD": 1,
            "2AC": 4,
            "2BD": 5,
        };

        if (connectors[connector] !== undefined) {
            return connectors[connector];
        }
    } catch (error) {
        return null;
    }
};
