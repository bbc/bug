"use strict";

const mongoSingle = require("@core/mongo-single");
const sortHandlers = require("@core/sort-handlers");
const logger = require("@core/logger")(module);

const getValueByPath = (obj, path) => {
    return path.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), obj);
};

module.exports = async (sortField = null, sortDirection = "asc", filters = {}) => {
    try {
        let codecs = await mongoSingle.get("codecs");
        if (!codecs) {
            return [];
        }

        if (filters["name"]) {
            codecs = codecs.filter((codec) => {
                return codec["name"] && codec["name"].toLowerCase().indexOf(filters.name.toLowerCase()) > -1;
            });
        }

        if (filters["zone"]) {
            for (let eachZone of filters["zone"]) {
                codecs = codecs.filter((codec) => codec["zone"] === eachZone);
            }
        }

        if (filters["capabilities"]) {
            for (let eachCapability of filters["capabilities"]) {
                codecs = codecs.filter((codec) => codec["capabilities"].includes(eachCapability));
            }
        }

        if (filters["address"]) {
            codecs = codecs.filter((codec) => {
                return codec["address"] && codec["address"].indexOf(filters.address) > -1;
            });
        }

        if (filters["port"]) {
            codecs = codecs.filter((codec) => {
                return codec["port"] && codec["port"].toString().indexOf(filters.port.toString()) > -1;
            });
        }

        if (filters["device.name"]) {
            codecs = codecs.filter((codec) => {
                return (
                    getValueByPath(codec, "device.name") &&
                    getValueByPath(codec, "device.name").toLowerCase().indexOf(filters["device.name"].toLowerCase()) > -1
                );
            });
        }

        if (filters["device.location"]) {
            codecs = codecs.filter((codec) => {
                return (
                    getValueByPath(codec, "device.location") &&
                    getValueByPath(codec, "device.location").toLowerCase().indexOf(filters["device.location"].toLowerCase()) > -1
                );
            });
        }

        if (filters["device.tags"]) {
            for (let eachDeviceTag of filters["device.tags"]) {
                codecs = codecs.filter((codec) => getValueByPath(codec, "device.tags")?.includes(eachDeviceTag));
            }
        }

        if (filters["device.description"]) {
            codecs = codecs.filter((codec) => {
                return (
                    getValueByPath(codec, "device.description") &&
                    getValueByPath(codec, "device.description")
                        .toLowerCase()
                        .indexOf(filters["device.description"].toLowerCase()) > -1
                );
            });
        }

        if (filters["device.model"]) {
            codecs = codecs.filter((codec) => {
                return (
                    getValueByPath(codec, "device.model") &&
                    getValueByPath(codec, "device.model").toLowerCase().indexOf(filters["device.model"].toLowerCase()) > -1
                );
            });
        }

        if (filters["device.manufacturer"]) {
            codecs = codecs.filter((codec) => {
                return (
                    getValueByPath(codec, "device.manufacturer") &&
                    getValueByPath(codec, "device.manufacturer")
                        .toLowerCase()
                        .indexOf(filters["device.manufacturer"].toLowerCase()) > -1
                );
            });
        }

        if (filters["device.notes"]) {
            codecs = codecs.filter((codec) => {
                return (
                    getValueByPath(codec, "device.notes") &&
                    getValueByPath(codec, "device.notes").toLowerCase().indexOf(filters["device.notes"].toLowerCase()) > -1
                );
            });
        }

        const sortHandlerList = {
            id: sortHandlers.string,
            name: sortHandlers.string,
            address: sortHandlers.ipAddress,
            port: sortHandlers.number,
            "device.id": sortHandlers.string,
            "device.name": sortHandlers.string,
            "device.location": sortHandlers.string,
            "device.description": sortHandlers.string,
        };

        // sort
        if (sortField && sortHandlerList[sortField]) {
            if (sortField.indexOf(".") > -1) {
                const compareNestedStrings = (a, b) => {
                    return (getValueByPath(a, sortField) || "").localeCompare(getValueByPath(b, sortField) || "", "en", {
                        sensitivity: "base",
                    });
                };

                if (sortDirection === "asc") {
                    codecs.sort((a, b) => compareNestedStrings(a, b));
                } else {
                    codecs.sort((a, b) => compareNestedStrings(b, a));
                }
            } else if (sortDirection === "asc") {
                codecs.sort((a, b) => sortHandlerList[sortField](a, b, sortField));
            } else {
                codecs.sort((a, b) => sortHandlerList[sortField](b, a, sortField));
            }
        }

        return codecs;
    } catch (err) {
        logger.error(err.stack || err.message);
        throw err;
    }
};
