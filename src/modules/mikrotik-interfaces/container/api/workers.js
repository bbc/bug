const WorkerManager = require('../utils/WorkerManager');
const configGet = require("../services/config-get");

const instantiate = async () => {
    const config = await configGet();
    return new WorkerManager({ config: config });
}

const manager = instantiate();

module.exports = manager;