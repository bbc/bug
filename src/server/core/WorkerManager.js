"use strict";

/**
 * core/WorkerManager.js
 * Class providing management of and access to all workers registered
 * 0.0.1 17/05/2021 - Created first version (GH)
 * 0.0.2 17/05/2021 - Adapted for use in bug core (GH)
 * 0.0.3 18/06/2021 - Change the use of context (RM)
 * 0.0.3 18/06/2021 - Restart workers and access to collection (RM)
 * 0.1.0 27/01/2026 - Overhaul and refactor (GH)
 */

const { Worker, isMainThread, SHARE_ENV } = require("worker_threads");
const configGet = require("@core/config-get");
const path = require("path");
const fs = require("fs").promises;

class WorkerManager {
    constructor(folder, isModule = true) {
        this.isModule = isModule;
        this.fileExtension = "js";
        this.folder = folder || path.join(__dirname, "..", "workers");
        this.workers = [];
        this.config = null;

        this.options = {
            env: SHARE_ENV,
            execArgv: [...process.execArgv, "--unhandled-rejections=strict"],
        };

        this.setup();
    }

    async setup() {
        this.workers = await this.getWorkerFiles(this.folder);
        this.config = await configGet();

        if (this.isModule && this.config?.needsConfigured) {
            console.log("WorkerManager->setup: Module needs config, not starting workers.");
            return;
        }

        if (isMainThread) {
            await this.createWorkers();
        } else {
            console.log("WorkerManager->setup: Not starting workers in a worker thread.");
        }
    }

    async getWorkerFiles(folder) {
        try {
            const filenames = await fs.readdir(folder);
            return filenames
                .filter((f) => f.endsWith(`.${this.fileExtension}`))
                .map((filename) => ({
                    filename,
                    filepath: path.join(folder, filename),
                    restart: true,
                    restarting: false,
                    restartDelay: 0,
                    restartCount: 0,
                }));
        } catch (err) {
            console.error("WorkerManager->getWorkerFiles:", err);
            return [];
        }
    }

    async createWorkers() {
        for (let i = 0; i < this.workers.length; i++) {
            try {
                await this.createWorker(i);
            } catch (err) {
                console.error(`WorkerManager->createWorkers: Failed to create ${this.workers[i].filename}`, err);
            }
        }
    }

    async createWorker(index) {
        const workerInfo = this.workers[index];
        if (!workerInfo) return;

        console.log(`WorkerManager->createWorker: Starting ${workerInfo.filename}`);

        const worker = new Worker(workerInfo.filepath, {
            ...this.options,
            workerData: this.config,
        });

        workerInfo.worker = worker;
        workerInfo.state = "started";
        workerInfo.startTime = Date.now();

        worker.on("message", (msg) => this.handleMessage(msg, index));
        worker.on("error", (err) => this.handleError(err, index));
        worker.on("exit", (code) => this.handleExit(code, index));
        worker.on("online", () => this.handleOnline(index));
    }

    handleMessage(msg, index) {
        const worker = this.workers[index];
        if (msg.restartOn) worker.restartKeys = msg.restartOn;
        if (typeof msg.restartDelay === "number") worker.restartDelay = msg.restartDelay;
    }

    handleError(err, index) {
        const worker = this.workers[index];
        console.error(`WorkerManager->handleError (${worker.filename}):`, err);
        worker.state = "error";
    }

    handleOnline(index) {
        this.workers[index].state = "running";
    }

    async handleExit(code, index) {
        const worker = this.workers[index];
        console.log(`WorkerManager->handleExit: ${worker.filename} exited with code ${code}`);
        worker.state = "stopped";

        if (worker.restart && !worker.restarting) {
            worker.restarting = true;
            console.log(`WorkerManager->handleExit: Restarting ${worker.filename} in ${worker.restartDelay / 1000}s`);
            setTimeout(async () => {
                await this.createWorker(index);
                worker.restarting = false;
                console.log(`WorkerManager->handleExit: ${worker.filename} restarted OK`);
            }, worker.restartDelay);
        } else {
            delete worker.worker;
        }
    }

    async restartWorker(index) {
        const worker = this.workers[index];
        worker.restartCount++;
        worker.restart = true;
        worker.restarting = true;

        if (worker.worker) {
            console.log(`WorkerManager->restartWorker: terminating ${worker.filename}`);
            const code = await worker.worker.terminate();
            console.log(`WorkerManager->restartWorker: ${worker.filename} terminated with code ${code}`);
        } else {
            console.log(`WorkerManager->restartWorker: creating worker ${worker.filename}`);
            await this.createWorker(index);
        }
    }

    needsUpdated(oldObj, newObj, keys) {
        if (!keys) return true;
        return keys.some((key) => oldObj[key] !== newObj[key]);
    }

    async pushConfig(newConfig) {
        const oldConfig = this.config;
        this.config = newConfig;

        for (let i = 0; i < this.workers.length; i++) {
            if (this.needsUpdated(oldConfig, newConfig, this.workers[i].restartKeys)) {
                await this.restartWorker(i);
            }
        }
    }

    async terminateWorkers() {
        for (let worker of this.workers) {
            if (worker.worker) {
                worker.restart = false;
                const code = await worker.worker.terminate();
                console.log(`Terminated ${worker.filename} with code ${code}`);
                worker.state = "stopped";
                delete worker.worker;
            }
        }
    }
}

module.exports = WorkerManager;
