#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const repoRoot = path.resolve(__dirname, "..");
const modulesRoot = path.join(repoRoot, "src", "modules");

function hasTestFiles(dirPath) {
    const stack = [dirPath];

    while (stack.length > 0) {
        const current = stack.pop();
        const entries = fs.readdirSync(current, { withFileTypes: true });

        for (const entry of entries) {
            if (entry.name === "node_modules" || entry.name.startsWith(".")) {
                continue;
            }

            const fullPath = path.join(current, entry.name);
            if (entry.isDirectory()) {
                stack.push(fullPath);
                continue;
            }

            if (/\.(test|spec)\.[cm]?[jt]sx?$/.test(entry.name)) {
                return true;
            }
        }
    }

    return false;
}

function getTestableModules() {
    if (!fs.existsSync(modulesRoot)) {
        throw new Error(`Modules root not found: ${modulesRoot}`);
    }

    const testable = [];

    for (const moduleName of fs.readdirSync(modulesRoot)) {
        const containerPath = path.join(modulesRoot, moduleName, "container");
        const packagePath = path.join(containerPath, "package.json");

        if (!fs.existsSync(packagePath)) {
            continue;
        }

        try {
            const pkg = JSON.parse(fs.readFileSync(packagePath, "utf8"));
            if (!pkg?.scripts?.test) {
                continue;
            }

            if (!hasTestFiles(containerPath)) {
                continue;
            }

            testable.push({ moduleName, containerPath });
        } catch (error) {
            console.warn(`Skipping invalid package.json for ${moduleName}: ${error.message}`);
        }
    }

    return testable.sort((a, b) => a.moduleName.localeCompare(b.moduleName));
}

function parseJestSummary(output) {
    const lines = output.split(/\r?\n/);
    const summary = {
        suitePassed: null,
        suiteFailed: null,
        suiteTotal: null,
        testPassed: null,
        testFailed: null,
        testTotal: null,
    };

    for (const line of lines) {
        if (line.startsWith("Test Suites:")) {
            const passedMatch = line.match(/(\d+)\s+passed/);
            const failedMatch = line.match(/(\d+)\s+failed/);
            const totalMatch = line.match(/(\d+)\s+total/);

            summary.suitePassed = passedMatch ? Number(passedMatch[1]) : 0;
            summary.suiteFailed = failedMatch ? Number(failedMatch[1]) : 0;
            summary.suiteTotal = totalMatch ? Number(totalMatch[1]) : null;
        }

        if (line.startsWith("Tests:")) {
            const passedMatch = line.match(/(\d+)\s+passed/);
            const failedMatch = line.match(/(\d+)\s+failed/);
            const totalMatch = line.match(/(\d+)\s+total/);

            summary.testPassed = passedMatch ? Number(passedMatch[1]) : 0;
            summary.testFailed = failedMatch ? Number(failedMatch[1]) : 0;
            summary.testTotal = totalMatch ? Number(totalMatch[1]) : null;
        }
    }

    return summary;
}

function run() {
    const listOnly = process.argv.includes("--list");
    const modules = getTestableModules();

    if (modules.length === 0) {
        console.log("No modules with both a test script and test files were found.");
        return;
    }

    console.log(`Discovered ${modules.length} testable module(s).`);

    if (listOnly) {
        for (const { moduleName } of modules) {
            console.log(`- ${moduleName}`);
        }
        return;
    }

    const failed = [];
    const moduleSummaries = [];

    for (const { moduleName, containerPath } of modules) {
        console.log("==================================================");
        console.log(`Running tests for: ${moduleName}`);

        const result = spawnSync("npm", ["run", "test"], {
            cwd: containerPath,
            stdio: "pipe",
            encoding: "utf8",
        });

        if (result.stdout) {
            process.stdout.write(result.stdout);
        }
        if (result.stderr) {
            process.stderr.write(result.stderr);
        }

        const combinedOutput = `${result.stdout || ""}\n${result.stderr || ""}`;
        moduleSummaries.push({
            moduleName,
            ...parseJestSummary(combinedOutput),
        });

        if (result.status !== 0) {
            failed.push(moduleName);
            console.log(`Result: FAIL (${moduleName})`);
            continue;
        }

        console.log(`Result: OK (${moduleName})`);
    }

    console.log("==================================================");
    const passedCount = modules.length - failed.length;
    console.log(`Module tests complete. Passed: ${passedCount}, Failed: ${failed.length}`);

    let suitePassed = 0;
    let suiteFailed = 0;
    let suiteTotal = 0;
    let suiteCountedModules = 0;
    let testPassed = 0;
    let testFailed = 0;
    let testTotal = 0;
    let testCountedModules = 0;

    for (const summary of moduleSummaries) {
        if (summary.suiteTotal !== null) {
            suitePassed += summary.suitePassed || 0;
            suiteFailed += summary.suiteFailed || 0;
            suiteTotal += summary.suiteTotal;
            suiteCountedModules += 1;
        }

        if (summary.testTotal !== null) {
            testPassed += summary.testPassed || 0;
            testFailed += summary.testFailed || 0;
            testTotal += summary.testTotal;
            testCountedModules += 1;
        }
    }

    console.log("Summary by module:");
    for (const summary of moduleSummaries) {
        const suiteText =
            summary.suiteTotal === null
                ? "suites: n/a"
                : `suites: ${summary.suitePassed}/${summary.suiteTotal} passed`;
        const testText =
            summary.testTotal === null ? "tests: n/a" : `tests: ${summary.testPassed}/${summary.testTotal} passed`;
        console.log(`- ${summary.moduleName}: ${suiteText}, ${testText}`);
    }

    console.log("Overall Jest summary:");
    if (suiteCountedModules > 0) {
        console.log(`- Test suites: ${suitePassed}/${suiteTotal} passed (${suiteFailed} failed)`);
    } else {
        console.log("- Test suites: n/a");
    }

    if (testCountedModules > 0) {
        console.log(`- Tests: ${testPassed}/${testTotal} passed (${testFailed} failed)`);
    } else {
        console.log("- Tests: n/a");
    }

    if (failed.length > 0) {
        console.log(`Failed modules: ${failed.join(", ")}`);
        process.exitCode = 1;
    }
}

run();
