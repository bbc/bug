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

const readMd = async (filepath) => {
    try {
        const data = await fs.promises.readFile(filepath);
        return data.toString();
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
nav_order: ${index + 1}
---

# ${modules[index].longname}

${modules[index].status?.toUpperCase()}
{: .label .label-${modules[index].status === "stable" ? "green" : "purple"} }

${modules[index].description}

![${modules[index].longname} Module Screenshot](/bug/assets/images/screenshots/module-${modules[index].name}.png)

## Default Configuration

${"```json\n" + JSON.stringify(modules[index].defaultconfig, null, 2) + "\n```"}            

`;

            if (!fs.existsSync(moduleDocsPath) && modules[index].name !== "index") {
                if (writeMd(moduleDocsPath, template)) {
                    console.log(`docs-templater: Docs template created for ${modules[index].name}`);
                }
            } else {
                let data = await readMd(moduleDocsPath);
                if (data) {
                    data = data.replace(/nav_order: \b([0-9]|[0-9][0-9]|100)\b/g, `nav_order: ${parseInt(index) + 1}`);
                    if (writeMd(moduleDocsPath, data)) {
                        console.log(`docs-templater: Docs template updated for ${modules[index].name}`);
                    }
                }
            }
        } catch (err) {
            console.error(`docs-templater: ${err}`);
        }
    }
};

templater();
