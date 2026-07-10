"use strict";

const iconsList = require("./icons-list");

describe("icons-list service", () => {
    test("returns an array of icon id strings", async () => {
        const icons = await iconsList();
        expect(icons).toBeArray();
        expect(icons.length).toBeGreaterThan(0);
        expect(typeof icons[0]).toBe("string");
    });

    test("MDI icons have kebab-case ids prefixed with mdi-", async () => {
        const icons = await iconsList();
        const mdiIcons = icons.filter((id) => id.startsWith("mdi-"));
        expect(mdiIcons.length).toBeGreaterThan(0);
        for (const id of mdiIcons) {
            // id should be kebab-case (no uppercase letters)
            expect(id).toMatch(/^mdi-[a-z0-9-]+$/);
        }
    });

    test("MDI icon list includes mdi-abacus", async () => {
        const icons = await iconsList();
        expect(icons).toContain("mdi-abacus");
    });
});
