"use strict";

const mongoSingle = require("@core/mongo-single");
const sortHandlers = require("@core/sort-handlers");

module.exports = async (sortField = null, sortDirection = "asc", filters = {}) => {
    let codecs = await mongoSingle.get("codecs");
    if (!codecs) {
        return [];
    }

    if (filters["name"]) {
        codecs = codecs.filter((codec) => {
            return codec["name"] && codec["name"].toLowerCase().indexOf(filters.name.toLowerCase()) > -1;
        });
    }

    if (filters["zones"]) {
        for (let eachZone of filters["zones"]) {
            codecs = codecs.filter((codec) => codec["zones"].includes(eachZone));
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

    if (filters["devicename"]) {
        codecs = codecs.filter((codec) => {
            return (
                codec["devicename"] && codec["devicename"].toLowerCase().indexOf(filters.devicename.toLowerCase()) > -1
            );
        });
    }

    if (filters["devicelocation"]) {
        codecs = codecs.filter((codec) => {
            return (
                codec["devicelocation"] &&
                codec["devicelocation"].toLowerCase().indexOf(filters.devicelocation.toLowerCase()) > -1
            );
        });
    }

    if (filters["devicetags"]) {
        for (let eachDeviceTag of filters["devicetags"]) {
            codecs = codecs.filter((codec) => codec["devicetags"].includes(eachDeviceTag));
        }
    }

    if (filters["devicedescription"]) {
        codecs = codecs.filter((codec) => {
            return (
                codec["devicedescription"] &&
                codec["devicedescription"].toLowerCase().indexOf(filters.devicedescription.toLowerCase()) > -1
            );
        });
    }

    if (filters["devicemodel"]) {
        codecs = codecs.filter((codec) => {
            return (
                codec["devicemodel"] &&
                codec["devicemodel"].toLowerCase().indexOf(filters.devicemodel.toLowerCase()) > -1
            );
        });
    }

    if (filters["devicemanufacturer"]) {
        codecs = codecs.filter((codec) => {
            return (
                codec["devicemanufacturer"] &&
                codec["devicemanufacturer"].toLowerCase().indexOf(filters.devicemanufacturer.toLowerCase()) > -1
            );
        });
    }

    if (filters["devicenotes"]) {
        codecs = codecs.filter((codec) => {
            return (
                codec["devicenotes"] &&
                codec["devicenotes"].toLowerCase().indexOf(filters.devicenotes.toLowerCase()) > -1
            );
        });
    }

    const sortHandlerList = {
        id: sortHandlers.string,
        name: sortHandlers.string,
        address: sortHandlers.ipAddress,
        port: sortHandlers.number,
        deviceid: sortHandlers.string,
        devicename: sortHandlers.string,
        devicelocation: sortHandlers.string,
        devicedescription: sortHandlers.string,
        deviceid: sortHandlers.string,
    };

    // sort
    if (sortField && sortHandlerList[sortField]) {
        if (sortDirection === "asc") {
            codecs.sort((a, b) => sortHandlerList[sortField](a, b, sortField));
        } else {
            codecs.sort((a, b) => sortHandlerList[sortField](b, a, sortField));
        }
    }

    return codecs;
};
