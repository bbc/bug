'use strict';

const { Worker, isMainThread, workerData } = require('worker_threads');
const configGet = require("../services/config-get");
const path = require('path');
const fs = require('fs');

let restartKeys = [];

module.exports = class WorkerManager {

    constructor(folder, config) {

        this.fileExtension = 'js'
        this.folder = folder || path.join(__dirname, '..', 'workers');

        this.workerFiles = this.getWorkerFiles(this.folder);
        this.workers = [];

        this.setConfig(config);
    }

    async setConfig(config) {
        if (config) {
            this.config = config;
        }
        else {
            this.config = await configGet();
        }
        if (this.config.id) {
            this.createWorkers(this.workerFiles);
        }
    }

    getWorkerFiles(folder) {
        const filenames = fs.readdirSync(folder);
        const jsFiles = [];

        for (let filename of filenames) {
            const extension = filename.split('.').pop();

            if (extension === this.fileExtension) {
                jsFiles.push(path.join(folder, filename));
            }
        }

        return jsFiles;
    }

    async createWorkers(filenames) {
        if (isMainThread) {
            for (let i = 0; i < filenames.length; i++) {
                this.workers[i] = await this.createWorker(filenames[i], i);
            }
        }
        else {
            console.log(`WorkerManager->createWorkers: You're trying to launch workers in a worker.`);
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

    async createWorker(filename, i) {
        console.log(`WorkerManager->createWorker: Creating a worker from ${filename}.`)
        const worker = await new Worker(filename, { workerData: { index: i, config: this.config } });
        await worker.on('message', this.handleMessage);
        await worker.on('error', this.handleError);
        await worker.on('exit', this.handleExit);
        return worker;
    }

    handleMessage(event) {
        restartKeys[event.index] = event.restartOn;
    }

    handleError(event) {
        console.log(`WorkerManager->handleError: ${event}`);
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

    async pushConfig(newConfig) {

        for (let i = 0; i < this.workerFiles.length; i++) {

            if (this.needsUpdated(this.config, newConfig, restartKeys[i])) {

                if (this.workers[i]) {
                    const state = await this.workers[i].terminate();
                    console.log(`WorkerManager->pushConfig: ${this.workerFiles} terminated with code ${state}`);
                }
                this.config = await newConfig;
                this.workers[i] = await this.createWorker(this.workerFiles[i], i);
            }
        }
    }

}