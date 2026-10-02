"use strict";

module.exports = {
    testEnvironment: "node",
    testMatch: ["<rootDir>/{api,services,workers}/**/?(*.)+(test|spec).js"],
    moduleNameMapper: {
        "^@api/(.*)$": "<rootDir>/api/$1",
        "^@core/(.*)$": "<rootDir>/core/$1",
        "^@routes/(.*)$": "<rootDir>/api/routes/$1",
        "^@services/(.*)$": "<rootDir>/services/$1",
        "^@utils/(.*)$": "<rootDir>/utils/$1",
    },
};
