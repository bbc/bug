"use strict";

const { ToadScheduler, SimpleIntervalJob, AsyncTask } = require("toad-scheduler");
const logger = require("@core/logger")(module);
const path = require("path");

let scheduler;

module.exports = ({ tasks, context, baseDir }) => {

    scheduler = new ToadScheduler();

    for (const task of tasks) {
        if (task.retry !== undefined && typeof task.retry !== "boolean") {
            throw new Error(`invalid retry option for task ${task.name}`);
        }

        const taskPath = path.join(baseDir, "tasks", task.name);

        let handler;
        try {
            handler = require(taskPath);
        } catch (err) {
            logger.error(`failed to load task file: ${task.name}`);
            throw err;
        }

        const addJob = () => {
            logger.info(`starting task ${task.name}, interval: ${task.seconds}s`);
            scheduler.addSimpleIntervalJob(
                new SimpleIntervalJob(
                    { seconds: task.seconds, runImmediately: true },
                    new AsyncTask(task.name, async () => {
                        let result = await handler(context);
                        // A task can request a retry when its prerequisites are not ready.
                        while (result === false && task.retry === true) {
                            await new Promise((resolve) => setTimeout(resolve, 5000));
                            result = await handler(context);
                        }
                    }),
                    {
                        preventOverrun: true,
                    }
                ),
            );
        };

        if (task.delay && task.delay > 0) {
            logger.info(`delaying start of task ${task.name} by ${task.delay}s`);
            setTimeout(addJob, task.delay * 1000); // convert seconds to ms
        } else {
            addJob();
        }
    }

    logger.info(`${tasks.length} task(s) scheduled, scheduler started`);
};

// keep node alive
process.stdin.resume();