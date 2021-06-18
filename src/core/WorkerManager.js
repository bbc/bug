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

const mongoDb = require("@core/mongo-db");
const arraySaveMongo = require("@core/array-savemongo");

let workers = [];
let config;

module.exports = class WorkerManager {
    constructor(folder) {
        this.fileExtension = "js";
        this.folder = folder || path.join(__dirname, "..", "workers");
        this.setup();
    }

    async setup() {
        config = await configGet();

        if (!config) {
            console.log(
                `WorkerManager->setup: No panel config. Not starting workers`
            );
            return;
        }

        this.collection = await this.createCollection(config.id);
        workers = await this.getWorkerFiles(this.folder);
        await this.updateWorkers(workers);
        await this.createWorkers();
    }

    async createCollection(panelId) {
        await mongoDb.connect(panelId);
        return await mongoDb.db.collection("workers");
    }

    async getWorkers() {
        return await this.collection.find().toArray();
    }

    async getWorkerIndex(filename) {
        const index = await workers
            .map(function (worker) {
                return worker.filename;
            })
            .indexOf(filename);
        return index;
    }

    async updateWorkers() {
        for (let index in workers) {
            workers[index].timestamp = Date.now();
        }
        arraySaveMongo(this.collection, workers, "filename");
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
                        restartCount: 0,
                        filename: path.join(folder, filename),
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
            for (let worker of workers) {
                await this.createWorker(worker.filename, config);
            }
            await this.updateWorkers();
        } else {
            console.log(
                `WorkerManager->createWorkers: You're trying to launch workers in a worker.`
            );
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

    async createWorker(filename) {
        console.log(
            `WorkerManager->createWorker: Creating a worker from ${filename}.`
        );
        const index = await this.getWorkerIndex(filename);
        const worker = await new Worker(filename, {
            workerData: config,
        });

        workers[index].state = "started";

        const handleMessage = async (event, filename, self) => {
            if (event?.restartOn) {
                workers[await self.getWorkerIndex(filename)].restartKeys =
                    event.restartOn;
            }
            if (event?.restartDelay) {
                workers[await self.getWorkerIndex(filename)].restartDelay =
                    event.restartDelay;
            } else {
                workers[await self.getWorkerIndex(filename)].restartDelay = 0;
            }
            await self.updateWorkers();
        };

        const handleError = async (event, filename, self) => {
            const index = await self.getWorkerIndex(filename);
            console.log(
                `WorkerManager->handleError ${workers[index].filename}`,
                event
            );
            workers[index].state = "error";
            await self.updateWorkers();
        };

        const handleOnline = async (event, filename, self) => {
            const index = await self.getWorkerIndex(filename);
            workers[index].state = "working";
            await self.updateWorkers();
        };

        const handleExit = async (event, filename, self) => {
            const index = await self.getWorkerIndex(filename);
            workers[index].state = "stopped";
            if (!workers[index].restarting) {
                await delay(workers[index].restartDelay);
            }
            if (workers[index].restart) {
                await self.createWorker(filename, config);
                workers[index].restarting = true;
                console.log(
                    `WorkerManager->handleExit: ${filename} restarted.`
                );
            } else {
                delete workers[index].worker;
                console.log(`WorkerManager->handleExit: ${filename} stopped.`);
            }
            await self.updateWorkers();
        };

        await worker.on("message", (event) =>
            handleMessage(event, filename, this)
        );
        await worker.on("error", (event) => handleError(event, filename, this));
        await worker.on("exit", (event) => handleExit(event, filename, this));
        await worker.on("online", (event) =>
            handleOnline(event, filename, this)
        );

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

    async restartWorker(filename) {
        const index = await this.getWorkerIndex(filename);
        workers[index].restartCount++;

        if (workers[index]?.worker) {
            workers[index].restart = true;
            workers[index].restarting = true;
            const state = await workers[index].worker.terminate();
            console.log(
                `WorkerManager->restartWorder: ${filename} terminated with code ${state}`
            );
        }
    }

    async pushConfig(newConfig) {
        for (let i in workers) {
            if (this.needsUpdated(config, newConfig, workers[i].restartKeys)) {
                config = newConfig;
                await this.restartWorker(workers[i].filename);
            } else {
                console.log(
                    `WorkerManager->pushConfig: ${workers[i]?.filename} doesn't need restarted.`
                );
            }
        }
        await this.updateWorkers();
    }
};
