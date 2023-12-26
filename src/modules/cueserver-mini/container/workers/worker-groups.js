"use strict";

const { parentPort, workerData } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoSingle = require("@core/mongo-single");
const axios = require("axios");
const cheerio = require("cheerio");
const rangeParser = require("parse-numeric-range");

// Tell the manager the things you care about
// make sure you add an array of config fields in 'restartOn' - the worker will restart whenever these are updated
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: [],
});

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData.id);

    // Kick things off
    console.log(`worker-groups: connecting to device`);

    // use an infinite loop
    while (true) {
        // do stuff here

        const url = `http://${workerData.address}/group_list`;
        try {
            // make the request
            const response = await axios.get(url);

            // we'll do some basic html trimming first as there are no nice class or id selectors to use
            let html = response.data;
            html = html.substring(html.indexOf("Triggers"));
            html = html.substring(html.indexOf("<table"));
            html = html.substring(0, html.indexOf("</table>") + 8);

            const $ = cheerio.load(html);
            const dataArray = [];

            $("tr").each((i, el) => {
                const values = [];
                $(el)
                    .find("td")
                    .each((j, tdElem) => {
                        values.push($(tdElem).text());
                    });

                dataArray.push(values);
            });

            const groupList = dataArray.map((d) => {
                if (d.length > 1) {
                    return {
                        number: parseInt(d[0]),
                        name: d[1],
                        channels: rangeParser(d[2]),
                    };
                }
            });

            const filteredGroupList = groupList.filter((g) => {
                return g !== undefined;
            });

            await mongoSingle.set("groupList", filteredGroupList, 60);
        } catch (error) {
            console.log(`worker-groups: ${error.stack || error.trace || error || error.message}`);
        }

        await delay(10000);
    }
};

main();
