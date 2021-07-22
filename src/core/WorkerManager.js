"use strict";

/**
 * core/WorkerManager.js
 * Class providing management of and access to all workers registered
 * 0.0.1 17/05/2021 - Created first version (GH)
 * 0.0.2 17/05/2021 - Adapted for use in bug-core (GH)
 * 0.0.3 18/06/2021 - Change the use of context (RM)
 * 0.0.3 18/06/2021 - Restart workers and access to collection (RM)
 */

const { Worker, isMainThread, workerData } = require("worker_threads");
const configGet = require("@core/config-get");
const path = require("path");
const fs = require("fs");
const delay = require("delay");

let workers = [];
let config;

module.exports = class WorkerManager {
    constructor(folder) {
        this.fileExtension = "js";
        this.folder = folder || path.join(__dirname, "..", "workers");
        this.setup();
        this.options = {
            execArgv: [...process.execArgv, "--unhandled-rejections=strict"],
        };
    }

    async setup() {
        workers = await this.getWorkerFiles(this.folder);
        config = await configGet();
        if (!config) {
            console.log(`WorkerManager->setup: No panel config. Starting workers without one...`);
        }
        //Start workers whether there's a config or not
        await this.createWorkers();
    }

    async getWorkers() {
        return workers;
    }

    async getWorkerIndex(filename) {
        const index = await workers
            .map(function (worker) {
                return worker.filename;
            })
            .indexOf(filename);
        return index;
    }

    async getWorkerFiles(folder) {
        try {
            const filenames = await fs.readdirSync(folder);
            const jsFiles = [];

            for (let filename of filenames) {
                const extension = filename.split(".").pop();

                if (extension === this.fileExtension) {
                    jsFiles.push({
                        restart: true,
                        restarting: false,
                        restartDelay: 0,
                        restartCount: 0,
                        filename: filename,
                        filepath: path.join(folder, filename),
                    });
                }
            }
            return jsFiles;
        } catch (error) {
            console.log(`WorkerManager->getWorkerFiles`, error);
            return [];
        }
    }

    async createWorkers() {
        if (isMainThread) {
            for (let worker in workers) {
                await this.createWorker(worker, config);
            }
        } else {
            console.log(`WorkerManager->createWorkers: You're trying to launch workers in a worker.`);
        }
    }

    terminateWorkers() {
        for (let i in workers) {
            workers[index].restart = false;
            const state = workers[i].worker.terminate();
            if (state) {
                workers[i].state = "stopped";
                delete workers[i].worker;
            }
        }
    }

    async createWorker(index) {
        const filename = workers[index]?.filename;
        console.log(`WorkerManager->createWorker: Creating a worker from ${filename}.`);
        const worker = await new Worker(workers[index]?.filepath, {
            ...this.options,
            ...{
                workerData: config,
            },
        });

        workers[index].state = "started";

        const handleMessage = async (event, filename, self) => {
            if (event?.restartOn) {
                workers[index].restartKeys = event.restartOn;
            }
            if (!isNan(event?.restartDelay)) {
                workers[index].restartDelay = event.restartDelay;
            } else {
                workers[index].restartDelay = 0;
            }
        };

        const handleError = async (event, filename, self) => {
            console.log(`WorkerManager->handleError ${workers[index].filename}`, event);
            workers[index].state = "error";
        };

        const handleOnline = async (event, filename, self) => {
            workers[index].state = "running";
        };

        const handleExit = async (event, filename, self) => {
            console.log(`WorkerManager->handleExit: ${filename} stopped.`);
            workers[index].state = "stopped";
            if (!workers[index].restarting) {
                console.log(
                    `WorkerManager->handleExit: Restarting ${filename} in ${Math.round(
                        workers[index].restartDelay / 1000
                    )} seconds.`
                );
                await delay(workers[index].restartDelay);
            }
            if (workers[index].restart) {
                await self.createWorker(index, config);
                workers[index].restarting = false;
                console.log(`WorkerManager->handleExit: ${filename} restarted.`);
            } else {
                delete workers[index].worker;
                console.log(`WorkerManager->handleExit: ${filename} stopped.`);
            }
        };

        await worker.on("message", (event) => handleMessage(event, filename, this));
        await worker.on("error", (event) => handleError(event, filename, this));
        await worker.on("exit", (event) => handleExit(event, filename, this));
        await worker.on("online", (event) => handleOnline(event, filename, this));

        workers[index].startTime = await Date.now();
        workers[index].worker = worker;
    }

    needsUpdated(object, newObject, keys) {
        if (!keys) {
            return true;
        }

        for (let key of keys) {
            if (object[key] !== newObject[key]) {
                return true;
            }
        }
        return false;
    }

    async restartWorker(index) {
        workers[index].restartCount++;

        if (workers[index]?.worker) {
            workers[index].restart = true;
            workers[index].restarting = true;
            const state = await workers[index].worker.terminate();
            console.log(`WorkerManager->restartWorder: ${workers[index]?.filename} terminated with code ${state}`);
        }
    }

    async pushConfig(newConfig) {
        const oldConfig = config;
        config = newConfig;
        for (let index in workers) {
            if (this.needsUpdated(oldConfig, newConfig, workers[index].restartKeys)) {
                await this.restartWorker(index);
            } else {
                console.log(`WorkerManager->pushConfig: ${workers[index]?.filename} doesn't need restarted.`);
            }
        }
    }
};
