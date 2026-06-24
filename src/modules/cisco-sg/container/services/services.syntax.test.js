const fs = require("fs");
const path = require("path");

const serviceFiles = fs
    .readdirSync(__dirname)
    .filter((file) => file.endsWith(".js") && !file.endsWith(".test.js"))
    .sort();

describe("services syntax smoke", () => {
    test.each(serviceFiles)("loads %s", (file) => {
        const serviceModule = require(path.join(__dirname, file));
        expect(typeof serviceModule).toBe("function");
    });
});
