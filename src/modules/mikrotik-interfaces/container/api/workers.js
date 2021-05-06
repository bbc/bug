const WorkerManager = require('../utils/WorkerManager');
const configGet = require("../services/config-get");

let workerManager;

const instantiate = async () => {
    const config = await configGet();
    workerManager = await new WorkerManager({ config: config })
}

instantiate();

module.exports = workerManager;

