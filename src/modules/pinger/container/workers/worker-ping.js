"use strict";

const { parentPort, workerData } = require("worker_threads");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const ping = require("ping");
const mongoCreateIndex = require("@core/mongo-createindex");
const { IncomingWebhook } = require("@slack/webhook");

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["hosts"],
});

const config = {
    timeout: 10,
    extra: ["-i", "5"],
};

const filteredResponse = (response) => {
    return {
        min: response?.min,
        max: response?.max,
        avg: response?.avg,
        stddev: response?.stddev,
        packetLoss: response?.packetLoss,
        timestamp: new Date(),
    };
};

const getOutageString = (lastPinged) => {
    if (lastPinged && lastPinged instanceof Date) {
        const downtime = new Date(new Date() - new Date(lastPinged));
        const downtimeString = `${String(downtime.getHours()).padStart(2, "0")}:${String(
            downtime.getMinutes()
        ).padStart(2, "0")}:${String(downtime.getSeconds()).padStart(2, "0")}`;
        return `Outage lasted ${downtimeString}.`;
    }
};

const main = async () => {
    let webhook;
    if (workerData?.webhook) {
        webhook = new IncomingWebhook(workerData?.webhook);
    }

    // Connect to the db
    await mongoDb.connect(workerData.id);
    let hostsCollection = await mongoDb.db.collection("hosts");
    await mongoCreateIndex(hostsCollection, "timestamp", { expireAfterSeconds: workerData.frequency * 20 });

    while (true) {
        const pingsPerDay = parseInt((1 / workerData.frequency) * 60 * 60 * 24);

        if (workerData.hosts) {
            for (let hostId in workerData.hosts) {
                const host = workerData.hosts[hostId];

                const exisitingHost = await hostsCollection.findOne({ hostId: hostId });

                if (!exisitingHost || exisitingHost.lastPinged < new Date() - workerData.frequency * 1000) {
                    const response = await ping.promise.probe(host.host, {
                        timeout: 0.5,
                        extra: ["-c", "3", "-i", "0.1"],
                    });

                    //Add database entry
                    const query = { hostId: hostId };
                    const update = {
                        $set: {
                            timestamp: new Date(),
                            lastPinged: response?.alive ? new Date() : exisitingHost?.lastPinged,
                            lastOutage: response?.alive ? exisitingHost?.lastOutage : new Date(),
                            acknowledged: response?.alive ? false : exisitingHost?.acknowledged,
                            lastOutageDuration: response?.alive
                                ? exisitingHost?.lastOutageDuration
                                : new Date() - new Date(exisitingHost?.lastPinged),
                            time: response?.avg,
                            alive: response?.alive,
                            hostId: hostId,
                        },
                        $push: {
                            data: {
                                $each: [{ ...filteredResponse(response) }],
                                $slice: -pingsPerDay,
                                $sort: { timestamp: 1 },
                            },
                        },
                    };
                    const options = { upsert: true };
                    await hostsCollection.updateOne(query, update, options);

                    // Send Slack Notifications
                    if (webhook) {
                        const bugHost = process.env.BUG_HOST || "127.0.0.1";
                        const bugPort = process.env.BUG_PORT || "80";

                        //Send device is offline message
                        if (!response?.alive && exisitingHost?.alive) {
                            webhook.send({
                                attachments: [
                                    {
                                        title: `:x: ${host?.title}`,
                                        text: `${host?.title} (<http://${bugHost}:${bugPort}/panel/${workerData?.id}/host/${hostId}|${host?.host}>) is no longer reachable.`,
                                        color: `#f44336`,
                                    },
                                ],
                            });

                            //Send device is back online message
                        } else if (
                            response?.alive &&
                            !exisitingHost?.alive &&
                            exisitingHost?.lastPinged !== undefined
                        ) {
                            webhook.send({
                                attachments: [
                                    {
                                        title: `:large_green_circle: ${host?.title}`,
                                        text: `${host?.title}  (<http://${bugHost}:${bugPort}/panel/${
                                            workerData?.id
                                        }/host/${hostId}|${host?.host}>) is online. ${getOutageString(
                                            exisitingHost?.lastPinged
                                        )}`,
                                        color: `#4caf50`,
                                    },
                                ],
                            });
                        }
                    }
                }
            }
        }
    }
};

main();
