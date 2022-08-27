"use strict";

const register = require("module-alias/register");
const moduleConfig = require("@models/module-config");
const fs = require("fs");
const path = require("path");

const writeMd = async (filepath, contents) => {
    try {
        await fs.promises.writeFile(filepath, contents);
        return true;
    } catch (err) {
        console.error(`docs-templater: ${err}`);
        return false;
    }
};

const templater = async () => {
    const modules = await moduleConfig.list();

    for (let index in modules) {
        try {
            const moduleDocsPath = path.resolve(
                path.join("..", "docs", "pages", "modules", `${modules[index].name}.md`)
            );

            const template = `---
layout: page
title: ${modules[index].longname}
parent: Modules
nav_order: ${index}
---

# ${modules[index].longname}

${modules[index].description}

# Default Configuration

${"```\n" + JSON.stringify(modules[index].defaultconfig, null, 2) + "\n```"}            

`;

            if (!fs.existsSync(moduleDocsPath) && modules[index].name !== "index") {
                if (writeMd(moduleDocsPath, template)) {
                    console.log(`docs-templater: Docs template created for ${modules[index].name}`);
                }
            }
        } catch (err) {
            console.error(`docs-templater: ${err}`);
        }
    }
};

templater();
