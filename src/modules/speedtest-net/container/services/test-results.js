"use strict";

const logger = require("@core/logger")(module);
const mongoCollection = require("@core/mongo-collection");
const mongoSingle = require("@core/mongo-single");
const testStatusClean = require("./test-status-clean");

const RUNNING_RESULT_MAX_AGE_MS = 45 * 1000;

const buildTestSummary = (result = {}) => {
    if (result?.failed || result?.timedOut || result?.status === "failed" || result?.error) {
        return "Test failed";
    }

    const publicIp = result?.interface?.externalIp || "Unknown";
    const server = result?.server?.name || "Unknown";
    const isp = result?.isp || "Unknown";

    return `Test from ${publicIp} to ${server} using ISP ${isp}`;
};

const formatMmSs = (milliseconds) => {
    const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

const buildStatusRow = (schedule = null, results = []) => {
    const latestResult = results[0];
    const latestResultAgeMs = latestResult?.timestamp ? Date.now() - Date.parse(latestResult.timestamp) : null;
    const latestResultIsActiveRunning = Boolean(
        latestResult?.running && latestResultAgeMs !== null && latestResultAgeMs <= RUNNING_RESULT_MAX_AGE_MS
    );

    const isRunning = Boolean(schedule?.scheduleState === "running" || latestResultIsActiveRunning);

    if (isRunning) {
        const startedAt = latestResultIsActiveRunning
            ? latestResult?.timestamp
            : schedule?.startedAt || schedule?.lastRunAt;
        const elapsed = startedAt ? formatMmSs(Date.now() - Date.parse(startedAt)) : null;

        return {
            statusRowType: "running",
            testSummary: elapsed ? `Test running ${elapsed}` : "Test running",
        };
    }

    const isScheduled = Boolean(schedule?.periodicTesting && schedule?.nextRunAt);
    if (isScheduled) {
        return {
            statusRowType: "scheduled",
            testSummary: `Next test starting in ${formatMmSs(Date.parse(schedule.nextRunAt) - Date.now())}`,
        };
    }

    return null;
};

module.exports = async (resultsLimit = 10) => {
    try {
        await testStatusClean();

        const testCollection = await mongoCollection("test-results");
        const [results, schedule] = await Promise.all([
            testCollection
                .find({}, { sort: { timestamp: -1 } })
                .limit(parseInt(resultsLimit))
                .toArray(),
            mongoSingle.get("test-schedule"),
        ]);

        const statusRow = buildStatusRow(schedule, results);

        // Running entries are transient placeholders while speedtest is in progress.
        // Keep them out of the table body and show only the synthetic status row instead.
        const visibleResults = results.filter((result) => !result?.running);

        const decoratedResults = visibleResults.map((result) => ({
            ...result,
            testSummary: buildTestSummary(result),
        }));

        return statusRow ? [statusRow, ...decoratedResults] : decoratedResults;
    } catch (error) {
        logger.error(`failed to fetch test results: ${error.message}`);
        throw error;
    }
};
