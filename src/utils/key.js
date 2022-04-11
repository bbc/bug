"use strict";

const { nanoid } = require("nanoid");
const keyLength = process.env.KEY_LENGTH || 30;

module.exports = async () => {
    return await nanoid(keyLength);
};
