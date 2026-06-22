"use strict";

const logger = require("@core/logger")(module);
const mongoSingle = require("@core/mongo-single");
const speedtest = require("./../utils/speedtest");

module.exports = async () => {
    try {
        // Check if periodic testing is enabled and reset the timer
        const schedule = await mongoSingle.get("test-schedule");
        if (schedule?.periodicTesting && schedule?.interval) {
            const intervalMs = schedule.interval * 60 * 1000;
            const nextRunAt = new Date(Date.now() + intervalMs).toISOString();
            await mongoSingle.set("test-schedule", {
                ...schedule,
                nextRunAt,
                scheduleState: "waiting",
            });
            logger.debug("manual test started, periodic timer reset");
        }

        Promise.resolve(speedtest()).catch((error) => {
            logger.error(`speedtest failed: ${error.message}`);
        });

        return { running: true };
    } catch (error) {
        logger.error(`speedtest failed to start: ${error.message}`);
        throw error;
    }
};
