"use strict";

const express = require("express");
const asyncHandler = require("express-async-handler");
const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");
const routerCache = require("@services/router-cache");

const router = express.Router();

const validateGroups = (groups, portCount, type) => {
    if (!Array.isArray(groups)) {
        throw new Error(`${type} groups must be an array`);
    }

    const names = new Set();
    return groups.map((group) => {
        if (
            !group ||
            typeof group.name !== "string" ||
            !group.name.trim() ||
            !Array.isArray(group.value) ||
            group.value.some((index) => !Number.isInteger(index) || index < 0 || index >= portCount)
        ) {
            throw new Error(`Invalid ${type} group`);
        }
        const name = group.name.trim();
        const normalizedName = name.toLocaleLowerCase();
        if (names.has(normalizedName)) {
            throw new Error(`${type} group names must be unique`);
        }
        names.add(normalizedName);
        return { name, value: [...new Set(group.value)] };
    });
};

router.put(
    "/",
    asyncHandler(async (req, res) => {
        const config = await configGet();
        if (!config) {
            throw new Error("Failed to load AJA KUMO panel configuration");
        }
        const state = await routerCache.get();
        config.sourceGroups = validateGroups(req.body?.sourceGroups, state.matrixSize.sources, "source");
        config.destinationGroups = validateGroups(
            req.body?.destinationGroups,
            state.matrixSize.destinations,
            "destination"
        );
        const saved = await configPutViaCore(config);
        if (!saved) {
            throw new Error("Failed to save AJA KUMO port groups");
        }
        res.json({ status: "success", data: true });
    })
);

module.exports = router;
