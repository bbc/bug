const { Worker } = require("worker_threads");
const { promises: fs } = require("fs");
const path = require("path");

module.exports = async () => {
    workerFolderPath = path.join(__dirname, "..", "workers");

    // fetch a list of available workers
    const workerList = await fs.readdir(workerFolderPath);

    // loop through them and start each one
    for (let eachWorker of workerList) {
        let workerPath = path.join(workerFolderPath, eachWorker);

        // create the new worker
        let worker = new Worker(workerPath);

        // Listen for messages from the worker and print them.
        worker.on("message", (msg) => {
            console.log("message from worker", msg);
        });
    }
};
