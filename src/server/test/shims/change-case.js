const paramCase = (input) => {
    const text = String(input == null ? "" : input)
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .replace(/[_\s]+/g, " ")
        .trim()
        .toLowerCase();

    return text.length === 0 ? "" : text.split(/\s+/).join("-");
};

module.exports = {
    paramCase,
};
