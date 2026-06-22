"use strict";

const logger = require("@core/logger")(module);
const mongoCollection = require("@core/mongo-collection");

const STALL_TIMEOUT_S = 60;

module.exports = async () => {
    try {
        const testCollection = await mongoCollection("test-results");

        // Find the latest test result
        const latestTest = await testCollection.findOne({}, { sort: { timestamp: -1 } });

        if (!latestTest) {
            return null;
        }

        // Check if it's marked as running but is older than 60 seconds
        if (latestTest.running === true) {
            const testAgeMs = Date.now() - new Date(latestTest.timestamp).getTime();

            if (testAgeMs > STALL_TIMEOUT_S * 1000) {
                logger.warning(`detected stalled test (${Math.round(testAgeMs / 1000)}s old), marking as failed`);

                await testCollection.updateOne(
                    { _id: latestTest._id },
                    {
                        $set: {
                            running: false,
                            failed: true,
                            timedOut: true,
                            status: "failed",
                            error: `Test did not complete within ${STALL_TIMEOUT_S} seconds`,
                        },
                    }
                );

                // Return the corrected document
                return await testCollection.findOne({ _id: latestTest._id });
            }
        }

        return latestTest;
    } catch (error) {
        logger.error(`failed to check for stalled tests: ${error.message}`);
        return null;
    }
};
