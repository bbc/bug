#!/usr/bin/env node

const fs = require("fs");
const { execSync } = require("child_process");
const path = require("path");

const GITHUB_REPO = "https://github.com/bbc/bug";

const CHANGELOG_FILE = path.resolve("CHANGELOG.md");
const PACKAGE_FILES = [
    path.resolve("package.json"),
    path.resolve("src/client/package.json")
];

console.log("processing app updates ...");

// helpers
function readJson(file) {
    return JSON.parse(fs.readFileSync(file, "utf-8"));
}

function writeJson(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function bumpVersion(version, level) {
    let [major, minor, patch] = version.split(".").map(Number);

    if (level === "major") {
        major += 1;
        minor = 0;
        patch = 0;
    } else if (level === "minor") {
        minor += 1;
        patch = 0;
    } else {
        patch += 1;
    }

    return `${major}.${minor}.${patch}`;
}

function compareVersions(a, b) {
    const pa = a.split(".").map(Number);
    const pb = b.split(".").map(Number);

    for (let i = 0; i < 3; i++) {
        if (pa[i] > pb[i]) return 1;
        if (pa[i] < pb[i]) return -1;
    }
    return 0;
}

function hashExistsInHistory(hash) {
    try {
        execSync(`git cat-file -e ${hash}^{commit}`, { stdio: "ignore" });
        return true;
    } catch {
        return false;
    }
}

// read existing changelog
let existingContent = "";
let lastCommitHash = null;
let lastCommitDate = null;

if (fs.existsSync(CHANGELOG_FILE)) {
    existingContent = fs.readFileSync(CHANGELOG_FILE, "utf-8");

    // extract full hash from the first commit URL in the most recent version entry
    const hashMatch = existingContent.match(
        /### version [\d.]+[\s\S]*?\/commit\/([0-9a-f]{40})/
    );
    if (hashMatch) lastCommitHash = hashMatch[1];

    // extract the most recent date from the changelog as a fallback
    const dateMatch = existingContent.match(
        /### version [\d.]+[\s\S]*?- (\d{4}-\d{2}-\d{2}):/
    );
    if (dateMatch) lastCommitDate = dateMatch[1];
}

// build git log range argument - with fallback if hash no longer exists
let rangeArg = "";
if (lastCommitHash) {
    if (hashExistsInHistory(lastCommitHash)) {
        rangeArg = `${lastCommitHash}..HEAD`;
        console.log(` - resuming from commit ${lastCommitHash.slice(0, 7)}`);
    } else if (lastCommitDate) {
        rangeArg = `--after="${lastCommitDate}"`;
        console.log(` - hash ${lastCommitHash.slice(0, 7)} not found (squashed?), falling back to date ${lastCommitDate}`);
    } else {
        console.log(` - hash not found and no date fallback, processing all commits`);
    }
}

// fetch commits (exclude modules)
let gitLog = "";
try {
    gitLog = execSync(
        `git log --pretty=format:"%H|%ad|%s" --date=short ${rangeArg} -- . ":(exclude)src/modules"`,
        { encoding: "utf-8" }
    );
} catch {
    console.log(" - no new commits");
    process.exit(0);
}

if (!gitLog.trim()) {
    console.log(" - no new commits");
    process.exit(0);
}

// collect existing commit descriptions to deduplicate against
const existingDescriptions = new Set(
    [...existingContent.matchAll(/^- \d{4}-\d{2}-\d{2}: (.+?) \(\[/gm)].map(m => m[1])
);

// parse [app] commits
const commits = gitLog
    .split("\n")
    .map(line => {
        const [hash, date, message] = line.split("|");
        const match = message.match(/^\[app\](?:\[(breaking)\])?\s*(.+)$/i);
        if (!match) return null;

        return {
            hash,
            date,
            description: match[2],
            breaking: Boolean(match[1])
        };
    })
    .filter(Boolean)
    .filter(c => {
        if (existingDescriptions.has(c.description)) {
            console.log(` - skipping duplicate: ${c.description}`);
            return false;
        }
        return true;
    });

if (!commits.length) {
    console.log(" - no [app] commits to process");
    process.exit(0);
}

console.log(` - found ${commits.length} app commit(s)`);

// read & validate package versions
const packages = PACKAGE_FILES.map(pkgPath => {
    if (!fs.existsSync(pkgPath)) {
        throw new Error(`Missing ${pkgPath}`);
    }
    return {
        path: pkgPath,
        data: readJson(pkgPath)
    };
});

const versions = packages.map(p => p.data.version || "0.0.0");

// pick highest version
const currentVersion = versions.sort(compareVersions).at(-1);

if (new Set(versions).size !== 1) {
    console.log(
        ` - versions out of sync (${versions.join(", ")}), using latest ${currentVersion}`
    );
}

// determine bump level
const bumpLevel = commits.some(c => c.breaking) ? "minor" : "patch";
const newVersion = bumpVersion(currentVersion, bumpLevel);

if (existingContent.includes(`### version ${newVersion}`)) {
    console.log(` - version ${newVersion} already exists, skipping bump`);
    process.exit(0);
}

// write package.json updates
packages.forEach(pkg => {
    pkg.data.version = newVersion;
    writeJson(pkg.path, pkg.data);
    console.log(
        ` - bumped ${path.relative(process.cwd(), pkg.path)} ${currentVersion} -> ${newVersion}`
    );
});

// build changelog entry
let newMd = `### version ${newVersion}\n\n`;

commits
    .sort((a, b) => b.date.localeCompare(a.date))
    .forEach(c => {
        const shortHash = c.hash.slice(0, 7);
        const commitUrl = `${GITHUB_REPO}/commit/${c.hash}`;
        newMd += `- ${c.date}: ${c.description} ([${shortHash}](${commitUrl}))\n`;
    });

newMd += "\n";

if (!existingContent) {
    existingContent = "## Changelog\n\n";
}

existingContent = existingContent.replace(
    /^## Changelog\s*/i,
    `## Changelog\n\n${newMd}`
);

fs.writeFileSync(CHANGELOG_FILE, existingContent);

console.log(" - updated app CHANGELOG.md");

// create and push Git tag
try {
    const tags = execSync(`git tag`, { encoding: "utf-8" }).split("\n");
    const tagName = `v${newVersion}`;
    if (tags.includes(tagName)) {
        console.log(` - git tag ${tagName} already exists, skipping tag creation`);
    } else {
        execSync(`git tag ${tagName}`);
        execSync(`git push origin ${tagName}`);
        console.log(` - created and pushed git tag ${tagName}`);
    }
} catch (err) {
    console.error(" - failed to create/push git tag:", err.message);
}

console.log(`app release ${newVersion} complete`);