'use strict';

const { Worker, isMainThread, workerData } = require('worker_threads');
const path = require('path');
const fs = require('fs');

let restartKeys = [];

module.exports = class WorkerManager {

    constructor({ folder = path.join(__dirname, '..', 'workers'), config = null } = { folder: 'Folder to look for workers', config: 'The config to pass to works on start' }) {

        this.fileExtension = 'js'
        this.config = config;

        this.workerFiles = this.getWorkerFiles(folder);
        this.workers = [];

        if (this.config.id) {
            this.workers = this.createWorkers(this.workerFiles);
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
        const workers = [];
        if (isMainThread) {
            for (let i = 0; i < filenames.length; i++) {
                workers[i] = await this.createWorker(filenames[i], i);
            }
        }
        else {
            console.log(`WorkerManager: You're trying to launch workers in a worker.`)
        }
        return workers;
    }

    terminateWorkers() {
        for (let i = 0; i < this.workers.length; i++) {
            const state = this.workers[i].worker.terminate();
            if (state) {
                this.worker.pop(i);
            }
        }
    }

    async createWorker(filename, i) {
        const worker = await new Worker(filename, { stdout: false, workerData: { index: i, config: this.config } });
        worker.once('message', this.handleMessage);
        worker.on('error', this.handleError);
        worker.on('exit', this.handleExit);
        return worker;
    }

    handleMessage(event) {
        restartKeys[event.index] = event.restartOn;
    }

    handleError(event) {
        console.log('ERROR')
        console.log(event)
    }

    handleExit(event) {
        console.log('EXIT')
        console.log(event)
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
                    console.log(state)
                }
                this.config = await newConfig;
                this.workers[i] = await this.createWorker(this.workerFiles[i], i);
            }
        }
    }

}