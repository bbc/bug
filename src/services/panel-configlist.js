"use strict";

const fs = require("fs");
const util = require("util");
const readdir = util.promisify(fs.readdir);
const logger = require("@utils/logger")(module);
const readJson = require("@core/read-json");
const path = require("path");

module.exports = async function () {
  let files = [];
  const directory = path.join(__dirname, "..", "config");

  try {
    files = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    throw new Error(`Failed to read files in folder ${directory}`);
  }

  const response = [];
  for (let file of files) {
    try {
      if (file.name.includes("json")) {
        const filename = path.join(directory, file.name);
        const panelFile = await readJson(filename);
        if (panelFile) {
          response.push(panelFile);
        }
      }
    } catch (error) {
      logger.warning(`${error.stack || error.trace || error || error.message}`);
      throw new Error(`Failed to list panel config`);
    }
  }
  return response;
};