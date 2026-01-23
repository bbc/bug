import fs from "fs";
import yaml from "js-yaml";
import path from "path";

const srcModulesDir = path.resolve("../src/modules");
const docsPagesModulesDir = path.resolve("pages/modules");
const dataDir = path.resolve("_data");
const sidebarFile = path.join(dataDir, "sidebar.yml");

//ensure _data exists
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

// clear old modules pages
if (fs.existsSync(docsPagesModulesDir)) {
    fs.rmSync(docsPagesModulesDir, { recursive: true, force: true });
}
fs.mkdirSync(docsPagesModulesDir, { recursive: true });

function getModuleFolders(dir) {
    return fs
        .readdirSync(dir, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name);
}

function copyFolder(src, dest) {
    if (!fs.existsSync(src)) return;
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

    for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        entry.isDirectory() ? copyFolder(srcPath, destPath) : fs.copyFileSync(srcPath, destPath);
    }
}

// generate module pages and table data
const moduleFolders = getModuleFolders(srcModulesDir);
const tableRows = [];

for (const folder of moduleFolders) {
    const moduleSrcPath = path.join(srcModulesDir, folder);
    const moduleDocsPath = path.join(docsPagesModulesDir, folder);
    fs.mkdirSync(moduleDocsPath, { recursive: true });

    // Read module.json
    const metaFile = path.join(moduleSrcPath, "module.json");
    let meta = {};
    if (fs.existsSync(metaFile)) {
        meta = JSON.parse(fs.readFileSync(metaFile, "utf8"));
    }

    const title = meta.longname || meta.name || folder;
    const description = meta.description || "";
    const version = meta.version || "";
    const status = meta.status || "development";

    // Check if README exists
    const readmeFile = path.join(moduleSrcPath, "README.md");
    const hasContent = fs.existsSync(readmeFile);

    // Copy README.md to index.md with front matter if exists
    if (hasContent) {
        const frontMatter = `---
title: "${title}"
layout: page
description: "${description}"
permalink: /pages/modules/${folder}/
nav_exclude: true
---
`;
        const content = fs.readFileSync(readmeFile, "utf8");
        fs.writeFileSync(path.join(moduleDocsPath, "index.md"), frontMatter + content, "utf8");

        // Copy assets
        copyFolder(path.join(moduleSrcPath, "assets"), path.join(moduleDocsPath, "assets"));
    }

    // add row for Modules table
    tableRows.push({
        name: title,
        url: hasContent ? `/pages/modules/${folder}/` : null,
        description,
        version,
        status,
    });
}

// generate Modules index page with table ---
const modulesIndexPath = path.join(docsPagesModulesDir, "index.md");

// updated status colors and text color
const statusColors = {
    development: "#2167d2",
    beta: "#b76600",
    unstable: "#b76600",
    stable: "#008f00",
    archived: "#5f5f5f",
};

const tableMarkdown = tableRows.map(row => {
    const nameCell = row.url ? `[${row.name}](${row.url})` : row.name;
    const statusKey = row.status;
    const statusColor = statusColors[statusKey] || "gray";

    return `| ${nameCell} | ${row.description} | ${row.version} | <span style="display:inline-block;padding:0.15em 0.5em;background-color:${statusColor};border-radius:4px;">${statusKey}</span> |`;
});

const indexContent = `---
title: "Modules"
layout: page
description: "List of all modules"
permalink: /pages/modules/
---
# Modules

Below is a list of all available modules:

| Name | Description | Version | Status |
|------|-------------|---------|--------|
${tableMarkdown.join("\n")}
`;

fs.writeFileSync(modulesIndexPath, indexContent, "utf8");

// generate sidebar.yml
const sidebar = [
    {
        title: "Documentation",
        children: [
            {
                title: "Modules",
                children: [],
            },
        ],
    },
];

fs.writeFileSync(sidebarFile, yaml.dump(sidebar, { noRefs: true }), "utf8");

// verification output
console.log("\n\n - Sidebar structure:");
console.log(`   - Modules index page generated at ${modulesIndexPath}`);
console.log("   - Module pages generated in " + docsPagesModulesDir);
console.log(" - Done\n");
