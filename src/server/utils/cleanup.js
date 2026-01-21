const logger = require("@utils/logger")(module);
const schedule = require("node-schedule");
const dockerCleanup = require("@services/docker-cleanup");

const cleanup = process.env.CLEANUP || 2;

if (cleanup) {
    // cleanup recurs on the hour set by the environment variable
    const rule = new schedule.RecurrenceRule();
    rule.hour = cleanup;
    rule.minute = 0;

    logger.info(`Cleanup job set to run at ${cleanup.toString().padStart(2, "0")}:00 every day.`);

    // schedule cleanup
    schedule.scheduleJob(rule, dockerCleanup);
}
