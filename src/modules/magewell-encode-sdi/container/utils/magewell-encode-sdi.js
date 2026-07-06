const MagewellClient = require("@core/magewell-client");

const profile = {
    apiPath: "/mwapi",
    codeField: "status",
    successCodes: [0],
    authFailureCodes: [36, 37],
};

const createClient = (options = {}) => {
    return new MagewellClient({
        ...profile,
        ...options,
    });
};

module.exports = {
    profile,
    createClient,
};