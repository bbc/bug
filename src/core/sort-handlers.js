"use strict";

/**
 * core/sort-handlers.js
 * A number of sort handlers for different types of data types
 * 0.0.1 12/07/2021 - Created first version (GH)
 */

const string = (a, b, sortField) => {
    return a[sortField]?.localeCompare(b[sortField], "en", { sensitivity: "base" })
};

const ipAddress = (a, b, sortField) => {
    const num1 = Number(a[sortField].split(".").map((num) => (`000${num}`).slice(-3)).join(""));
    const num2 = Number(b[sortField].split(".").map((num) => (`000${num}`).slice(-3)).join(""));
    return num1 - num2;
};

const number = (a, b, sortField) => {
    return b[sortField] - a[sortField];
}

const boolean = (a, b, sortField) => {
    return b[sortField] - a[sortField];
}

module.exports = {
    string: string,
    ipAddress: ipAddress,
    number: number,
    boolean: boolean
}