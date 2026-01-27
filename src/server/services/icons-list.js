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
            logger.error(`icons-list: Failed to read folder ${directory}: ${error.message}`);
            throw new Error(`Failed to read icons directory`);
        }

        const prefixString = prefix ? `${prefix}-` : "";
        const icons = [];

        for (let filename of filenames.files) {
            if (path.extname(filename) === ".js") {
                const iconName = paramCase(path.parse(filename).name);
                let iconVariant = null;

                // check for variants (e.g., 'outlined', 'rounded')
                for (let eachVariant of iconsSettings.variants) {
                    if (iconName.endsWith(`-${eachVariant}`)) {
                        iconVariant = eachVariant;
                        break;
                    }
                }

                icons.push({
                    id: prefixString + iconName,
                    sortKey: iconName,
                    variant: iconVariant,
                });
            }
        }
        return icons;
    };

    const cacheKey = "muiIconsList";

    try {
        let icons = cacheStore.get(cacheKey);

        if (!icons) {
            logger.info("icons-list: cache miss - scanning MUI icons-material directory...");

            const iconsPath = path.join(__dirname, "..", "client", "node_modules", "@mui", "icons-material");
            const muiIcons = await fetchIcons(iconsPath);

            // filter out ignored icons
            icons = muiIcons.filter((icon) => !iconsSettings.ignoreIcons.includes(icon.id));

            // sort alphabetically
            icons.sort((a, b) => a.sortKey.localeCompare(b.sortKey));

            // set cache
            cacheStore.set(cacheKey, icons, 10);
            logger.info(`Icon Cache warmed with ${icons.length} icons.`);
        }

        // filter by variant and map to IDs
        return icons
            .filter((icon) => icon.variant === variant)
            .map((icon) => icon.id);

    } catch (error) {
        logger.error(`icons-list: ${error.stack}`);
        throw new Error(`Failed to fetch icons list`);
    }
};