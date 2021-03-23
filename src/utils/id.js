'use strict';

const id = require('nanoid');
const util = require('util');
const idLength =  process.env.ID_LENGTH || 15

module.exports = async (filename) => {
    return await id.nanoid(idLength)
}