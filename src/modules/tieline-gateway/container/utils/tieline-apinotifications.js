"use strict";

const httpDigestClient = require("http-digest-client");
const getBoundaryText = require("@utils/boundary-text");
const convert = require("xml-js");
const ensureArray = require("@utils/ensure-array");

module.exports = class TielineApiNotifications {
    constructor({ host = "127.0.0.1", port = 80, username = "admin", password = "password", timeout = 2000 }) {
        this.host = host;
        this.username = username;
        this.password = password;
        this.timeout = timeout;
        this.port = port;
    }

    get({ path = "", update = () => {}, keepAlive = () => {} }) {
        const client = httpDigestClient(this.username, this.password);
        let runningData = "";

        client.request(
            {
                host: this.host,
                path: path,
                port: 80,
                method: "GET",
                headers: {
                    "Content-Type": "application/xml",
                },
            },
            (res) => {
                res.on("data", function (data) {
                    // add new result to running data
                    runningData += data.toString();

                    // get boundary
                    const boundaryText = getBoundaryText(res);

                    if (runningData.indexOf(`--${boundaryText}`) > -1) {
                        // we've finished - remove the boundary
                        const contentWithoutBoundary = runningData.replace(`--${boundaryText}`, "");

                        // add a wrapper
                        const filteredLinesArray = ["<eventArray>"];

                        // remove 'content-type' lines
                        for (let eachLine of contentWithoutBoundary.split("\r\n")) {
                            if (eachLine && eachLine.indexOf("Content-type") === -1) {
                                filteredLinesArray.push(eachLine);
                            }
                        }

                        // close the wrapper
                        filteredLinesArray.push("</eventArray>");

                        // convert XML to JS object
                        const filteredLinesObject = convert.xml2js(filteredLinesArray.join("\n"), { compact: true });

                        if (Object.keys(filteredLinesObject["eventArray"])?.[0] === "keepalive") {
                            // it's a keep alive
                            keepAlive();
                        } else {
                            // it's an event
                            const eventsArray = ensureArray(filteredLinesObject["eventArray"]["event"]);
                            update(eventsArray);
                        }
                        runningData = "";
                    }
                });
                res.on("error", function (err) {
                    console.error(err);
                    reject();
                });
            }
        );
    }
};
