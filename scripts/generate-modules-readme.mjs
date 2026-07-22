#!/usr/bin/env node
/**
 * Regenerates the "Supported Modules" table in README.md between
 * the <!-- MODULES_START --> and <!-- MODULES_END --> sentinel comments.
 *
 * Modules with status "development", "beta", or "archived" are excluded.
 * Run automatically by the update-readme-modules GitHub Actions workflow.
 */

import { readdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const MODULES_DIR = join(ROOT, "src", "modules");
const README_PATH = join(ROOT, "README.md");

const EXCLUDED_STATUSES = new Set(["development", "beta", "archived"]);

const START_SENTINEL = "<!-- MODULES_START -->";
const END_SENTINEL = "<!-- MODULES_END -->";

// Collect and filter modules
const modules = readdirSync(MODULES_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((entry) => {
        const jsonPath = join(MODULES_DIR, entry.name, "module.json");
        try {
            const mod = JSON.parse(readFileSync(jsonPath, "utf8"));
            if (EXCLUDED_STATUSES.has(mod.status)) return [];
            return [{ name: mod.name, description: mod.description }];
        } catch {
            return [];
        }
    })
    .sort((a, b) => a.name.localeCompare(b.name));

// Build the markdown table
const table = [
    "| Module | Description |",
    "|---|---|",
    ...modules.map((m) => `| \`${m.name}\` | ${m.description} |`),
].join("\n");

// Splice into README between sentinels
let readme = readFileSync(README_PATH, "utf8");
const startIdx = readme.indexOf(START_SENTINEL);
const endIdx = readme.indexOf(END_SENTINEL);

if (startIdx === -1 || endIdx === -1) {
    console.error("Could not find MODULES_START / MODULES_END sentinels in README.md");
    process.exit(1);
}

// Update the modules table
readme =
    readme.slice(0, startIdx) +
    START_SENTINEL +
    "\n" +
    table +
    "\n" +
    readme.slice(endIdx);

// Update the module count in the features list (e.g. "45+ ready-made modules")
readme = readme.replace(/\*\*\d+\+ ready-made modules\*\*/, `**${modules.length}+ ready-made modules**`);

writeFileSync(README_PATH, readme, "utf8");
console.log(`Updated README.md with ${modules.length} stable modules.`);
