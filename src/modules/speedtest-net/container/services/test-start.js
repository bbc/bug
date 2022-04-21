"use strict";

const speedtest = require("./../utils/speedtest");

module.exports = () => {
    try {
        speedtest();
        return { data: { running: true }, message: "Speedtest started" };
    } catch (error) {
        console.log(error);
        return { error: error };
    }
};
