module.exports = (ip) => {
    if (ip.substr(0, 7) == "::ffff:") {
        ip = ip.substr(7);
    }
    return ip;
};
