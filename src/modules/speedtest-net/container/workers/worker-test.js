"use strict";

const { parentPort, workerData } = require("worker_threads");
const register = require("module-alias/register");
const delay = require("delay");
const mongoDb = require("@core/mongo-db");
const mongoSingle = require("@core/mongo-single");
const logger = require("@core/logger")(module);
const speedtest = require("./../utils/speedtest");

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["periodicTesting", "interval"],
});

const main = async () => {
    const intervalMinutes = Number(workerData.interval) || 15;
    const updateDelay = intervalMinutes * 60 * 1000;
    const schedule = {
        periodicTesting: Boolean(workerData.periodicTesting),
        interval: intervalMinutes,
        nextRunAt: null,
        lastRunAt: null,
        scheduleState: workerData.periodicTesting ? "waiting" : "idle",
    };

    const persistSchedule = async (updates = {}) => {
        Object.assign(schedule, updates, {
            periodicTesting: Boolean(workerData.periodicTesting),
            interval: intervalMinutes,
        });

        await mongoSingle.set("test-schedule", schedule);
    };

    // Connect to the db
    await mongoDb.connect(workerData.id);

    while (true) {
        if (!workerData.periodicTesting) {
            await persistSchedule({
                nextRunAt: null,
                scheduleState: "idle",
            });
            await delay(updateDelay);
            continue;
        }

        const nextRunAt = new Date(Date.now() + updateDelay).toISOString();
        await persistSchedule({
            nextRunAt,
            scheduleState: "waiting",
        });

        await delay(updateDelay);

        const lastRunAt = new Date().toISOString();
        await persistSchedule({
            lastRunAt,
            nextRunAt: null,
            scheduleState: "running",
        });

        logger.debug("starting periodic test");

        try {
            await speedtest();
        } catch (error) {
            logger.warning(`periodic test failed: ${error.message}`);
        }
    }
};

main().catch((error) => {
    logger.error(`worker failed: ${error.message}`);
});
