"use strict";

const videohub = require("@utils/videohub-promise");

module.exports = async (address, port) => {
    const router = new videohub({
        host: address,
        port: port,
    });

    await router.connect();

    return new Promise((resolve, reject) => {
        router.on("update", () => {
            resolve(true);
        });

        let count = 0;
        const setTimer = () => {
            if (count < 5) {
                count += 1;
                router.send("PING");
                setTimeout(setTimer, 200);
            } else {
                resolve(false);
            }
        };
        setTimer();
    });
};
