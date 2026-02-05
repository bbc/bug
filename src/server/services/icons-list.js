"use strict";

const logger = require("@utils/logger")(module);
const path = require("path");
const readDir = require("@core/read-dir");
const { paramCase } = require("change-case");
const cacheStore = require("@core/cache-store");

module.exports = async (variant = null) => {
    const fetchMUIIcons = async (directory) => {
        let filenames;
        try {
            filenames = await readDir(directory);
        } catch (error) {
            logger.error(`icons-list: Failed to read folder ${directory}: ${error.message}`);
            throw new Error(`Failed to read icons directory`);
        }

        const ignoreVariants = ["Outlined", "Rounded", "Sharp", "TwoTone", "Outline"];

        const icons = filenames.files
            .filter(filename => path.extname(filename) === ".js")
            .map(filename => path.parse(filename).name)
            .filter(iconName => !ignoreVariants.some(variant => iconName.endsWith(variant)))
            .map(iconName => ({
                id: iconName,
                sortKey: iconName,
                variant: null,
                type: "mui",
            }));


        return icons;
    };

    const fetchMDIIcons = async () => {
        let mdi;
        try {
            mdi = require("@mdi/js");
        } catch (err) {
            logger.error("icons-list: Failed to load @mdi/js package.");
            return [];
        }

        const icons = Object.keys(mdi).filter(key => !key.endsWith("Outline")).map((key) => ({
            id: `${paramCase(key)}`,
            sortKey: key,
            variant: null,
            type: "mdi",
        }));

        return icons;
    };

    const cacheKey = "allIconsList";

    try {
        let icons = cacheStore.get(cacheKey);

        if (!icons) {
            logger.info("icons-list: cache miss - scanning MUI and MDI icons...");

            const muiIconsPath = path.join(
                __dirname,
                "..",
                "..",
                "..",
                "node_modules",
                "@mui",
                "icons-material"
            );
            const muiIcons = await fetchMUIIcons(muiIconsPath);
            const mdiIcons = await fetchMDIIcons();

            icons = [...muiIcons, ...mdiIcons];

            const ignoreIcons = ["mdi-license-icon", "mdi-index-es", "mdi-index", "Index"];

            // filter out ignored icons
            icons = icons.filter((icon) => !ignoreIcons.includes(icon.id));

            // sort alphabetically
            icons.sort((a, b) => a.sortKey.localeCompare(b.sortKey));

            // set cache for 10 minutes
            cacheStore.set(cacheKey, icons, 10);
            logger.info(`icons-list: icon cache stored ${icons.length} icons.`);
        }

        // filter by variant and return IDs
        return icons
            .filter((icon) => {
                if (variant === null) return icon.variant === null;
                return icon.variant === variant;
            })
            .map((icon) => icon.id);

    } catch (error) {
        logger.error(`icons-list: ${error.stack}`);
        throw new Error("Failed to fetch icons list");
    }
};
