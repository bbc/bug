"use strict";

/**
 * core/WorkerManager.js
 * Class providing management of and access to all workers registered
 * 0.0.1 17/05/2021 - Created first version (GH)
 * 0.0.2 17/05/2021 - Adapted for use in bug-core (GH)
 */

const { Worker, isMainThread, workerData } = require("worker_threads");
const configGet = require("@core/config-get");
const path = require("path");
const fs = require("fs");
const delay = require("delay");

let restartKeys = [];

module.exports = class WorkerManager {
    constructor(folder, config) {
        this.fileExtension = "js";
        this.folder = folder || path.join(__dirname, "..", "workers");

        this.workerFiles = this.getWorkerFiles(this.folder);
        this.workers = [];

        this.setConfig(config);
    }

    async setConfig(config) {
        if (config) {
            this.config = config;
        } else {
            this.config = await configGet();
        }
        this.createWorkers(this.workerFiles);
    }

    getWorkerFiles(folder) {
        try {
            const filenames = fs.readdirSync(folder);
            const jsFiles = [];

            for (let filename of filenames) {
                const extension = filename.split(".").pop();

                if (extension === this.fileExtension) {
                    jsFiles.push(path.join(folder, filename));
                }
            }

            return jsFiles;
        } catch {
            return [];
        }
    }

    async createWorkers(filenames) {
        if (isMainThread) {
            for (let i = 0; i < filenames.length; i++) {
                this.workers[i] = await this.createWorker(
                    filenames[i],
                    i,
                    this.config
                );
            }
        } else {
            console.log(
                `WorkerManager->createWorkers: You're trying to launch workers in a worker.`
            );
        }
    }

    terminateWorkers() {
        for (let i = 0; i < this.workers.length; i++) {
            const state = this.workers[i].terminate();
            if (state) {
                this.workers.pop(i);
            }
        }
    }

    async createWorker(filename, i, config) {
        console.log(
            `WorkerManager->createWorker: Creating a worker from ${filename}.`
        );
        const worker = await new Worker(filename, {
            workerData: { index: i, config: config },
        });
        worker.on("message", this.handleMessage);
        worker.on("error", this.handleError);
        worker.on("exit", this.handleExit);
        return worker;
    }

    handleMessage(event) {
        if (event?.restartOn) {
            restartKeys[event.index] = event.restartOn;
        }
    }

    handleError(worker) {
        let delayMs = 10000; //10 secs
        if (worker?.delay) {
            delay = Math.round(worker?.delay);
        }
        if (worker?.error) {
            console.log(`WorkerManager->handleError`, worker.error);
        }
        if (worker?.index) {
            delay(delayMs);
            this.restartWorker(index, this.config);
        } else {
            console.log(
                `WorkerManager->handleError unhandled exception can't restart`,
                worker
            );
        }
    }

    handleExit(event) {
        console.log(`WorkerManager->handleExit: ${event}`);
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

    async restartWorker(index, config) {
        if (this.workers[index]) {
            const state = await this.workers[index].terminate();
            console.log(
                `WorkerManager->restartWorder: ${this.workerFiles[index]} terminated with code ${state}`
            );
        }
        this.workers[index] = await this.createWorker(
            this.workerFiles[index],
            index,
            config
        );
    }

    async pushConfig(newConfig) {
        const mergedConfig = { ...this.config, ...newConfig };

        for (let i = 0; i < this.workerFiles.length; i++) {
            if (this.needsUpdated(this.config, mergedConfig, restartKeys[i])) {
                this.restartWorker(i, mergedConfig);
            } else {
                console.log(
                    `WorkerManager->pushConfig: ${this.workerFiles[i]} doesn't need restarted.`
                );
            }
        }
        this.config = mergedConfig;
    }
};
