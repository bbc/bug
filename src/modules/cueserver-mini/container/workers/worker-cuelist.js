"use strict";

const { parentPort, workerData } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoSingle = require("@core/mongo-single");
const axios = require("axios");
const cheerio = require("cheerio");

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
    console.log(`worker-cuelist: connecting to device`);

    // use an infinite loop
    while (true) {
        // do stuff here

        const url = `http://${workerData.address}/cue_list`;
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

            const parseFade = (text) => {
                const fade = text.split(",")[0].split(" ")[1];
                if (fade === "---") {
                    return [0, 0];
                }
                return fade.split("/").map((f) => {
                    return parseFloat(f);
                });
            };

            const parseFollow = (text) => {
                const follow = text.split(", ")[1].split(" ")[1];
                if (follow === "---") {
                    return 0;
                }
                return parseFloat(follow);
            };

            const parseLink = (text) => {
                if (text === "(next)" || text === "(none)") {
                    return 0;
                }
                return parseFloat(text);
            };

            const cueList = dataArray.map((d) => {
                if (d.length > 1) {
                    return {
                        number: parseInt(d[0]),
                        name: d[1],
                        fade: parseFade(d[2]),
                        follow: parseFollow(d[2]),
                        link: parseLink(d[3]),
                    };
                }
            });

            const filteredCueList = cueList.filter((c) => {
                return c !== undefined;
            });

            await mongoSingle.set("cueList", filteredCueList, 60);
        } catch (error) {
            console.log(`worker-cuelist: ${error.stack || error.trace || error || error.message}`);
        }

        await delay(10000);
    }
};

main();
