"use strict";

const mongoSingle = require("@core/mongo-single");

module.exports = async (deviceData) => {
    if (deviceData?.["device_info"]) {
        return await mongoSingle.set("device", {
            front_panel_auto_lock: deviceData?.["device_info"]?.["front_panel_auto_lock"],
            front_panel_lock: deviceData?.["device_info"]?.["front_panel_lock"],
            front_panel_lock: deviceData?.["device_info"]?.["front_panel_lock"],
            front_panel_lock_timeout: deviceData?.["device_info"]?.["front_panel_lock_timeout"],
            front_panel_pin_set: deviceData?.["device_info"]?.["front_panel_pin_set"],
            model: deviceData?.["device_info"]?.["model"],
            name: deviceData?.["device_info"]?.["name"],
        });
    }
    return false;
};
