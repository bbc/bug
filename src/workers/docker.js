"use strict";

const { Worker, isMainThread, parentPort } = require("worker_threads");
const register = require("module-alias/register");
const logger = require("@utils/logger");
const dockerListContainerInfo = require("@services/docker-listcontainerinfo");
const dockerContainer = require("@models/docker-container");

async function fetch() {
    const containerInfoList = await dockerListContainerInfo();
    for (let eachContainer of containerInfoList) {
        eachContainer["containerid"] = eachContainer["id"];
        delete eachContainer.id;
    }
    await dockerContainer.setMultiple(containerInfoList);

    setTimeout(fetch, 1000);
}

fetch();
