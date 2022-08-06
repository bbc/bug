"use strict";

const Magewell = require("@utils/magewell");
const getConfig = require("@core/config-get");
let magewell;

const instantiate = async () => {
    if (!magewell) {
        const config = await getConfig();
        magewell = new Magewell(config?.address, config?.username, config?.password);
    }
};

instantiate();

module.exports = magewell;
