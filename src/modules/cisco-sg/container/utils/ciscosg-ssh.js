"use strict";
const SSH2Shell = require("ssh2shell");

module.exports = ({ host, port = 22, username, password, commands = [], debug = false, timeout = 5000 }) => {
    process.on("uncaughtException", function (err) {
        if (err.toString().indexOf("Connection closed") === -1) {
            console.log(err);
        }
    });

    const preCommands = ["terminal datadump", "terminal no prompt"];
    const results = [];

    const parseResponse = (command, response) => {
        if (preCommands.includes(command)) {
            return;
        }

        const responseLines = response.split("\n");
        let parsedLines = [];
        for (const eachLine of responseLines) {
            const trimmedLine = eachLine.replace(/(\r\n|\n|\r)/gm, "");
            if (trimmedLine !== command) {
                parsedLines.push(trimmedLine);
            }
        }

        // trim empty first line
        if (parsedLines.length > 0 && parsedLines[0] === "") {
            parsedLines = parsedLines.slice(1);
        }

        // remove hostname
        if (parsedLines.length > 0) {
            const lastLine = parsedLines[parsedLines.length - 1];
            // if it ends with a hash ...
            if (lastLine.length > 0 && lastLine.slice(-1) === "#") {
                // remove it
                parsedLines.pop();
            }
        }
        results.push(parsedLines.join("\n"));
    };

    return new Promise((resolve, reject) => {
        const ssh = new SSH2Shell({
            server: {
                host: host,
                port: port,
                userName: username,
                password: password,
                hashMethod: "md5",
                readyTimeout: 50000,
                algorithms: {
                    kex: [
                        "diffie-hellman-group-exchange-sha1",
                        "diffie-hellman-group1-sha1",
                        "diffie-hellman-group14-sha1",
                        "diffie-hellman-group-exchange-sha256",
                    ],
                    cipher: ["aes256-cbc", "aes128-ctr", "aes192-ctr", "aes256-ctr"],
                },
            },
            debug: debug,
            verbose: debug,
            commands: [...preCommands, ...commands],
            idleTimeOut: timeout,
            onCommandComplete: function (command, response, sshObj) {
                parseResponse(command, response);
            },
            onEnd: () => {
                resolve(results);
            },
            onError: () => {
                reject();
            },
        });

        try {
            ssh.connect();
        } catch (error) {
            console.log(error);
            reject();
        }
    });
};
