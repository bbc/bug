"use strict";

const register = require("module-alias/register");
const logger = require("@utils/logger")(module);
const mongoDb = require("@core/mongo-db");
const delay = require("delay");
const mongoSingle = require("@core/mongo-single");
const docker = require("@utils/docker");
const si = require("systeminformation");
const formatBps = require("@core/format-bps");
const formatBytes = require("@core/format-bytes");

const databaseName = process.env.BUG_CONTAINER || "bug";

const fetchHostCpu = async () => {
    const allCpuInfo = await si.cpu();
    return {
        manufacturer: allCpuInfo?.manufacturer,
        brand: allCpuInfo?.brand,
        cores: allCpuInfo?.cores,
    };
};

const fetchHostMemory = async () => {
    const allMemoryInfo = await si.mem();
    return {
        total: allMemoryInfo?.total,
        total_text: formatBytes(allMemoryInfo?.total),
        free: allMemoryInfo?.free,
        free_text: formatBytes(allMemoryInfo?.free),
        used: allMemoryInfo?.used,
        used_text: formatBytes(allMemoryInfo?.used),
    };
};

const fetchHostDisk = async () => {
    const df = await docker.df();

    const imageSize = df.Images.reduce((accumulator, object) => {
        return object.Size ? accumulator + object.Size : accumulator;
    }, 0);

    const containerSize = df.Containers.reduce((accumulator, object) => {
        return object.SizeRw ? accumulator + object.SizeRw : accumulator;
    }, 0);

    const volumeSize = df.Volumes.reduce((accumulator, object) => {
        return object?.UsageData?.Size ? accumulator + object?.UsageData?.Size : accumulator;
    }, 0);

    const buildCacheSize = df.BuildCache.filter((bc) => !bc.Shared).reduce((accumulator, object) => {
        return object.Size ? accumulator + object.Size : accumulator;
    }, 0);

    return {
        images: imageSize,
        images_text: formatBytes(imageSize),
        containers: containerSize,
        containers_text: formatBytes(containerSize),
        volumes: volumeSize,
        volumes_text: formatBytes(volumeSize),
        buildCache: buildCacheSize,
        buildCache_text: formatBytes(buildCacheSize),
        total: imageSize + containerSize + volumeSize + buildCacheSize,
        total_text: formatBytes(imageSize + containerSize + volumeSize + buildCacheSize),
    };
};

const fetchContainers = async () => {
    // fetch list of containers
    const containerList = await docker.listContainers();

    // fetch stats
    const dockerData = await si.dockerContainerStats("*");

    const containerStatsArray = [];

    for (let eachContainer of dockerData) {
        const containerDetails = containerList.find((container) => container.Id === eachContainer.id);
        if (containerDetails) {
            // only store containers in the bug network
            if (containerDetails?.HostConfig?.NetworkMode === "bug") {
                containerStatsArray.push({
                    id: eachContainer.id,
                    name: containerDetails.Names?.[0].replace(/^\/+/g, ""),
                    memory: {
                        used: eachContainer.memUsage,
                        used_text: formatBytes(eachContainer.memUsage),
                        total: eachContainer.memLimit,
                        total_text: formatBytes(eachContainer.memLimit),
                        free: eachContainer.memLimit - eachContainer.memUsage,
                        free_text: formatBytes(eachContainer.memLimit - eachContainer.memUsage),
                    },
                    cpu_percent: Math.round(eachContainer.cpuPercent * 100 + Number.EPSILON) / 100,
                    network: {
                        rx: eachContainer.netIO.rx ? eachContainer.netIO.rx : 0,
                        rx_text: formatBytes(eachContainer.netIO.rx),
                        tx: eachContainer.netIO.wx ? eachContainer.netIO.wx : 0,
                        tx_text: formatBytes(eachContainer.netIO.wx),
                    },
                    disk: {
                        r: eachContainer.blockIO.r ? eachContainer.blockIO.r : 0,
                        r_text: formatBytes(eachContainer.blockIO.r),
                        w: eachContainer.blockIO.w ? eachContainer.blockIO.w : 0,
                        w_text: formatBytes(eachContainer.blockIO.w),
                    },
                });
            }
        }
    }

    return containerStatsArray;
};

const addRates = (currentResult, previousResult) => {
    const timeDiff = currentResult.sampleTime - previousResult.sampleTime;
    for (let eachContainer of currentResult.containers) {
        const previousContainer = previousResult.containers.find((container) => container.id === eachContainer.id);
        if (previousContainer) {
            eachContainer.network.rx_rate =
                ((eachContainer.network.rx - previousContainer.network.rx) / timeDiff) * 1000;
            eachContainer.network.rx_ratetext = formatBps(eachContainer.network.rx_rate);

            eachContainer.network.tx_rate =
                ((eachContainer.network.tx - previousContainer.network.tx) / timeDiff) * 1000;
            eachContainer.network.tx_ratetext = formatBps(eachContainer.network.tx_rate);

            eachContainer.disk.r_rate = ((eachContainer.disk.r - previousContainer.disk.r) / timeDiff) * 1000;
            eachContainer.disk.r_ratetext = formatBps(eachContainer.disk.r_rate);

            eachContainer.disk.w_rate = ((eachContainer.disk.w - previousContainer.disk.w) / timeDiff) * 1000;
            eachContainer.disk.w_ratetext = formatBps(eachContainer.disk.w_rate);
        }
    }
    return currentResult;
};

const addHistoryItem = (previous, current, newValue, historyField) => {
    const maxLength = 10;
    if (!previous[historyField]) {
        current[historyField] = new Array(10);
    } else {
        current[historyField] = previous[historyField];
    }
    current[historyField].push(newValue);
    current[historyField].splice(0, current[historyField].length - maxLength);
};

const addHistory = (currentResult, previousResult) => {
    for (let eachContainer of currentResult.containers) {
        const previousContainer = previousResult?.containers.find((container) => container.id === eachContainer.id);
        if (previousContainer) {
            // CPU
            addHistoryItem(previousContainer, eachContainer, eachContainer.cpu_percent, "cpu_history");

            // disk
            addHistoryItem(
                previousContainer,
                eachContainer,
                Math.round((eachContainer.disk.r_rate + eachContainer.disk.w_rate) / 1000),
                "disk_history"
            );

            // network
            addHistoryItem(
                previousContainer,
                eachContainer,
                Math.round((eachContainer.network.rx_rate + eachContainer.network.tx_rate) / 1000),
                "network_history"
            );
        }
    }
    return currentResult;
};

const main = async () => {
    // Connect to the db
    await mongoDb.connect(databaseName);

    // remove any old data
    await mongoSingle.clear("systemHealth");

    try {
        while (true) {
            // fetch previous result
            const previousResult = await mongoSingle.get("systemHealth");

            const uptime = await si.time();

            // get new data
            let dataObject = {
                sampleTime: new Date(),
                host: {
                    uptime: uptime.uptime,
                    cpu: await fetchHostCpu(),
                    memory: await fetchHostMemory(),
                    disk: await fetchHostDisk(),
                },
                containers: await fetchContainers(),
            };

            if (previousResult) {
                // add calculations for bitrates per second using previous result
                dataObject = addRates(dataObject, previousResult);
            }
            dataObject = addHistory(dataObject, previousResult);

            await mongoSingle.set("systemHealth", dataObject, 60);

            await delay(2000);
        }
    } catch (error) {
        logger.warning(`workers/systemHealth: ${error.stack || error.trace || error || error.message}`);
        return;
    }
};

main();
