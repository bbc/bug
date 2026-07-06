"use strict";

const logger = require("@core/logger")(module);

module.exports = async ({ magewellClient, mongoSingle }) => {
	try {
		const response = await magewellClient.request("get-signal-info", {}, { requireAuth: false });

		const payload = response?.payload;

		if (!payload) {
			logger.error("missing signal payload from magewell device");
			return false;
		}

		const videoInfo = payload["video-info"] || {};
		const parsedPayload = {
			_active: Boolean(response?.ok),
			width: videoInfo["width"],
			height: videoInfo["height"],
			scan: videoInfo["scan"],
			"field-rate": videoInfo["field-rate"],
			"color-depth": videoInfo["color-depth"],
			"color-format": videoInfo["color-format"]
		};

		await mongoSingle.set("signal", parsedPayload, 60);

		logger.debug("fetched and saved signal payload");
		return true;
	} catch (error) {
		logger.error(`signal polling failed: ${error.message}`);
		throw error;
	}
};
