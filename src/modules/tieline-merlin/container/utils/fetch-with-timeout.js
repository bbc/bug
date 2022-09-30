"use strict";

const fetch = require("node-fetch");

module.exports = async (url, options = {}, timeout = 2000) => {
    let didTimeOut = false;

    return new Promise((resolve, reject) => {
        const timeoutTimer = setTimeout(function () {
            didTimeOut = true;
            reject(new Error("Request timed out"));
        }, timeout);

        fetch(url, options)
            .then(function (response) {
                // Clear the timeout as cleanup
                clearTimeout(timeoutTimer);
                if (!didTimeOut) {
                    resolve(response);
                }
            })
            .catch(function (err) {
                // Rejection already happened with setTimeout
                if (didTimeOut) return;

                // Reject with error
                reject(err);
            });
    });
    // .then(function () {
    //     // Request success and no timeout
    //     // console.log("good promise, no timeout! ");
    // })
    // .catch(function (err) {
    //     // Error: response error, request timeout or runtime error
    //     console.log("promise error! ", err);
    // });
};
