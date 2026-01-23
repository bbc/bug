import fs from "fs";
import yaml from "js-yaml";
import path from "path";

const repoRoot = path.resolve(".");
const srcModulesDir = path.join(repoRoot, "src/modules");
const docsPagesModulesDir = path.join(repoRoot, "docs/pages/modules");
const dataDir = path.join(repoRoot, "docs/_data");
const sidebarFile = path.join(dataDir, "sidebar.yml");

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(docsPagesModulesDir)) fs.mkdirSync(docsPagesModulesDir, { recursive: true });

if (!fs.existsSync(srcModulesDir)) {
    console.warn(`modules folder not found at ${srcModulesDir}. skipping module generation.`);
    process.exit(0);
}

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

const moduleFolders = getModuleFolders(srcModulesDir);
const tableRows = [];

for (const folder of moduleFolders) {
    const moduleSrcPath = path.join(srcModulesDir, folder);
    const moduleDocsPath = path.join(docsPagesModulesDir, folder);
    fs.mkdirSync(moduleDocsPath, { recursive: true });

    const metaFile = path.join(moduleSrcPath, "module.json");
    let meta = {};
    if (fs.existsSync(metaFile)) {
        meta = JSON.parse(fs.readFileSync(metaFile, "utf8"));
    }

    const title = meta.longname || meta.name || folder;
    const description = meta.description || "";
    const version = meta.version || "";
    let status = meta.status || "development";

    const readmeFile = path.join(moduleSrcPath, "README.md");
    const hasContent = fs.existsSync(readmeFile);

    // copy readme to index.md if it exists
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

        copyFolder(path.join(moduleSrcPath, "assets"), path.join(moduleDocsPath, "assets"));
    }

    tableRows.push({
        name: title,
        url: hasContent ? `/pages/modules/${folder}/` : null,
        description,
        version,
        status,
    });
}

// generate modules index page with table
const modulesIndexPath = path.join(docsPagesModulesDir, "index.md");

const statusColors = {
    development: "#2167d2",
    beta: "#b76600",
    unstable: "#b76600",
    stable: "#008f00",
    archived: "#5f5f5f",
};

const tableMarkdown = tableRows.map(row => {
    const nameCell = row.url ? `[${row.name}](${row.url})` : row.name;
    const statusColor = statusColors[row.status] || "#5f5f5f";

    return `| ${nameCell} | ${row.description} | ${row.version} | <span style="display:inline-block;padding:0.15em 0.5em;background-color:${statusColor};color:black;border-radius:4px;">${row.status}</span> |`;
});

const indexContent = `---
title: "Modules"
layout: page
description: "List of all modules"
permalink: /pages/modules/
---
# Modules

below is a list of all available modules:

| Name | Description | Version | Status |
|------|-------------|---------|--------|
${tableMarkdown.join("\n")}
`;

fs.writeFileSync(modulesIndexPath, indexContent, "utf8");

// generate sidebar with only parent modules heading
const sidebar = [
    {
        title: "Documentation",
        children: [
            {
                title: "Modules",
                url: null,
                children: [],
            },
        ],
    },
];

fs.writeFileSync(sidebarFile, yaml.dump(sidebar, { noRefs: true }), "utf8");

console.log("modules index page generated at:", modulesIndexPath);
console.log("module pages generated in:", docsPagesModulesDir);
console.log("sidebar written to:", sidebarFile);
console.log("all done");
