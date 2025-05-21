

module.exports = (inputString) => {
    const match = inputString.match(/^(\d+):(.+),$/);
    if (!match) {
        throw new Error(`Invalid netstring format: ${inputString}`);
    }

    const length = parseInt(match[1], 10);
    const data = match[2];

    if (data.length !== length) {
        throw new Error(`Length mismatch: expected ${length}, got ${data.length}`);
    }

    try {
        return JSON.parse(data.trim());
    } catch (error) {
        console.log(error);
        throw new Error(`Invalid JSON: ${data}`);
    }

}
