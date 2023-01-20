"use strict";

const logger = require("@utils/logger")(module);
const path = require("path");
const readDir = require("@core/read-dir");
const { paramCase } = require("change-case");
const cacheStore = require("@core/cache-store");
const iconsSettings = require("@services/icons-settings");

module.exports = async (variant = null) => {
    const fetchIcons = async (directory, prefix = null) => {
        let filenames;
        try {
            filenames = await readDir(directory);
        } catch (error) {
            throw new Error(`Failed to read files in folder ${directory}`);
        }

        const prefixString = prefix ? `${prefix}-` : "";

        const icons = [];
        for (let filename of filenames.files) {
            try {
                if (path.extname(filename) === ".js") {
                    const iconName = paramCase(path.parse(filename).name);
                    let iconVariant = null;
                    for (let eachVariant of iconsSettings.variants) {
                        if (iconName.endsWith(`-${eachVariant}`)) {
                            iconVariant = eachVariant;
                        }
                    }
                    icons.push({
                        id: prefixString + iconName,
                        sortKey: iconName,
                        variant: iconVariant,
                    });
                }
            } catch (error) {
                logger.warning(`${error.stack || error.trace || error || error.message}`);
                throw new Error(`Failed to fetch icon list`);
            }
        }
        return icons;
    };

    const cacheKey = "workersState";

    // check the cache first
    let icons = cacheStore.get(cacheKey);
    if (!icons) {
        const muiIcons = await fetchIcons(
            path.join(__dirname, "..", "client", "node_modules", "@mui", "icons-material")
        );

        const mdiIcons = await fetchIcons(
            path.join(__dirname, "..", "client", "node_modules", "mdi-material-ui"),
            "mdi"
        );

        icons = [...muiIcons, ...mdiIcons];

        icons = icons.filter((icon) => !iconsSettings.ignoreIcons.includes(icon.id));

        // sort by sortKey
        icons.sort((a, b) => (a.sortKey > b.sortKey ? 1 : -1));
    }

    // cache the result for 10 minutes
    cacheStore.set(cacheKey, icons, 1);

    // now filter by variant
    icons = icons.filter((icon) => icon.variant === variant);

    // extract the id (without the mdi prefix)
    return icons.map((icon) => icon.id);
};
