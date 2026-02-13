"use strict";

const { ToadScheduler, SimpleIntervalJob, Task } = require("toad-scheduler");
const logger = require("@core/logger")(module);
const path = require("path");

let scheduler;

module.exports = ({ tasks, context, baseDir }) => {

    scheduler = new ToadScheduler();

    for (const task of tasks) {
        const taskPath = path.join(baseDir, "tasks", task.name);

        let handler;
        try {
            handler = require(taskPath);
        } catch (err) {
            logger.error(`worker-taskmanager: failed to load task file: ${task.name}`);
            throw err;
        }

        logger.info(`worker-taskmanager: adding task ${task.name}, interval: ${task.seconds}`);
        scheduler.addSimpleIntervalJob(
            new SimpleIntervalJob(
                { seconds: task.seconds, runImmediately: true },
                new Task(task.name, async () => {
                    await handler(context);
                })
            ),
            {
                preventOverrun: true,
            }
        );
    }

    logger.info(`worker-taskmanager: ${tasks.length} task(s) added, scheduler started`);
};

// keep node alive
process.stdin.resume();

