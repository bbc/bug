const NodeCache = require("node-cache");

/**
 * core/cache-store.js
 * Creates a shared cache store for use across the nodejs app
 * 0.0.1 17/05/2021 - Created first version (GH)
 */

module.exports = new NodeCache();
