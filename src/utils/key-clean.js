module.exports = (key) => {
    if (key) {
        key = key.replace("Bearer ", "");
        key = key.trim();
    }
    return key;
};
