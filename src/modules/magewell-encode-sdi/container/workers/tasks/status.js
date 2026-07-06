"use strict";

const logger = require("@core/logger")(module);
const parseStatus = require("@utils/parse-status");

module.exports = async ({ magewellClient, mongoSingle }) => {
	try {
		const response = await magewellClient.request("get-status", {}, { requireAuth: false });
		const payload = response?.payload;

		if (!payload) {
			logger.error("missing status payload from magewell device");
			return false;
		}

		const parsedPayload = {};
		parsedPayload._isLive = parseStatus(payload["cur-status"], "isLiving");
		parsedPayload["cur-time"] = payload["cur-time"];
		parsedPayload["box-name"] = payload["box-name"];
		parsedPayload["cpu-temperature"] = payload["cpu-temperature"];
		parsedPayload["codec"] = payload["codec"];
		parsedPayload["sysstat"] = payload["sysstat"];
		parsedPayload["live-status"] = payload["live-status"];
		parsedPayload["vumeters"] = payload["vumeters"];

		await mongoSingle.set("status", parsedPayload, 60);

		logger.debug(`fetched and saved status payload`);
		return true;
	} catch (error) {
		logger.error(`status polling failed: ${error.message}`);
		throw error;
	}
};
