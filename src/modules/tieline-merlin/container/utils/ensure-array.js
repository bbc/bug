"use strict";

module.exports = (data) => {
    if (Array.isArray(data)) {
        return data;
    }
    return [data];
};
