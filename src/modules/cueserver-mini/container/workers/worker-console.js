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

const parseNumber = (text) => {
    if (text.indexOf("Playback ") === 0) {
        return parseInt(text.split(" ")[1].replace("*", ""));
    }
    return 0;
};

const parseActive = (text) => {
    return text.indexOf("*") > -1;
};

const parseCue = (text) => {
    if (text.indexOf("Cue ") === 0) {
        return parseInt(text.split(" ")[1]);
    }
    return null;
};

const parseFade = (text) => {
    if (text.indexOf("/") > -1) {
        const fade = text.split(" ")[0];
        return fade.split("/").map((f) => {
            return parseFloat(f);
        });
    }
    return [0, 0];
};

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData.id);

    // Kick things off
    console.log(`worker-console: connecting to device`);

    // use an infinite loop
    while (true) {
        // do stuff here

        const url = `http://${workerData.address}/console`;
        try {
            // make the request
            const response = await axios.get(url);

            // we'll do some basic html trimming first as there are no nice class or id selectors to use
            let html = response.data;
            html = html.substring(html.indexOf("Triggers"));
            html = html.substring(html.indexOf("<table"));
            html = html.substring(0, html.indexOf("</table><br>") + 8);

            const $ = cheerio.load(html);
            const dataArray = [];

            $("tr").each((i, el) => {
                const values = [];
                // const table = $(el).find("table");

                $(el)
                    .find("table")
                    .find("tr")
                    .each((k, playbackRow) => {
                        if (k === 0) {
                            // it's the header row
                            $(playbackRow)
                                .find("div")
                                .each((l, headerCell) => {
                                    values.push($(headerCell).text());
                                });
                        } else {
                            $(playbackRow)
                                .find("td")
                                .each((l, cell) => {
                                    values.push($(cell).text());
                                });
                        }
                    });
                if (values.length > 0) {
                    dataArray.push(values);
                }
            });

            const consoleList = dataArray.map((d) => {
                let next = 0;
                if (d[11] !== "-" && d[11] !== "None") {
                    next = parseInt(d[11]);
                }
                return {
                    number: parseNumber(d[0]),
                    active: parseActive(d[0]),
                    cue: parseCue(d[3]),
                    fade: parseFade(d[5]),
                    link: d[7] === "-" ? 0 : parseInt(d[7]),
                    output: d[9],
                    next: next,
                    followTime: d[13],
                    followTimer: d[15] === "-" ? 0 : parseInt(d[15]),
                    mode: d[17],
                };
            });

            await mongoSingle.set("consoleList", consoleList, 60);
        } catch (error) {
            console.log(`worker-console: ${error.stack || error.trace || error || error.message}`);
        }

        await delay(3000);
    }
};

main();
