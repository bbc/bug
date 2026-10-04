"use strict";

module.exports = (seconds) => {
    const days = Math.floor(seconds / 86400);
    const time = [
        Math.floor((seconds % 86400) / 3600),
        Math.floor((seconds % 3600) / 60),
        Math.floor(seconds % 60),
    ]
        .map((value) => String(value).padStart(2, "0"))
        .join(":");

    return days > 0 ? `${String(days).padStart(2, "0")}:${time}` : time;
};
