'use strict';

const { Worker, isMainThread, workerData } = require('worker_threads');
const mongodb = require('../utils/mongo-db');
const path = require('path');
const fs = require('fs');

let restartKeys = [];

module.exports = class WorkerManager {

    constructor({ folder = path.join(__dirname, '..', 'workers'), config = null } = { folder: 'Folder to look for workers', config: 'The config to pass to works on start' }) {

        this.fileExtension = 'js'
        this.config = config;

        this.workerFiles = this.getWorkerFiles(folder);
        this.workers = []

        this.getDB();
    }

    async getDB() {
        if (this.config) {
            this.db = await mongodb.connect(this.config.id);
            this.workers = await this.createWorkers(this.workerFiles);
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
                await this.createWorker(filenames[i],i);
            }
        }
        else {
            console.log(`WorkerManager: You're trying to launch workers in a worker.`)
        }
        return this.workers;
    }

    terminateWorkers() {
        for (let i = 0; i < this.workers.length; i++) {
            const state = this.workers[i].worker.terminate();
            if (state) {
                this.worker.pop(i);
            }
        }
    }

    async createWorker(filename,i){
        this.workers[i] = await new Worker(filename, { workerData: { index: i, config: this.config, db: this.db } });
        this.workers[i].once('message', this.handleMessage);
        this.workers[i].on('error', this.handleError);
        this.workers[i].on('exit', this.handleExit);
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
        for (let key of keys) {
            if (object[key] !== newObject[key]) {
                return true;
            }
        }
        return false;
    }

    async pushConfig(newConfig) {

        for (let i = 0; i < this.workers.length; i++) {

            if( this.needsUpdated(this.config,newConfig,restartKeys[i])){
                const state = await this.workers[i].terminate();
                await this.createWorker(filenames[i],i);
            }
            
        }

        this.config = newConfig;
    }

}