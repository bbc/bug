"use strict";

/**
 * core/sort-handlers.js
 * A number of sort handlers for different types of data types
 * 0.0.1 12/07/2021 - Created first version (GH)
 */

const string = (a, b, sortField) => {
    return a[sortField]?.localeCompare(b[sortField], "en", { sensitivity: "base" });
};

const ipAddress = (a, b, sortField) => {
    const num1 = a[sortField]
        ? Number(
              a[sortField]
                  .split(".")
                  .map((num) => `000${num}`.slice(-3))
                  .join("")
          )
        : 255255255255;
    const num2 = b[sortField]
        ? Number(
              b[sortField]
                  .split(".")
                  .map((num) => `000${num}`.slice(-3))
                  .join("")
          )
        : 255255255255;
    return num1 - num2;
};

const number = (a, b, sortField) => {
    return a[sortField] - b[sortField];
};

const boolean = (a, b, sortField) => {
    const val1 = b[sortField] === undefined ? false : b[sortField];
    const val2 = a[sortField] === undefined ? false : a[sortField];
    return val1 - val2;
};

module.exports = {
    string: string,
    ipAddress: ipAddress,
    number: number,
    boolean: boolean,
};
