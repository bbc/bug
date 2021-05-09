const WorkerManager = require('../utils/WorkerManager');

let manager;

const instantiate = () => {
    manager = new WorkerManager();   
}

instantiate();

module.exports = manager;
