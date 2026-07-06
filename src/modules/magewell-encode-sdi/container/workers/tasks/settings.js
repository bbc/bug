"use strict";

const logger = require("@core/logger")(module);

module.exports = async ({ magewellClient, mongoSingle }) => {
	try {
		const response = await magewellClient.request("get-settings", {}, { requireAuth: false });

		const payload = response?.payload;

		if (!payload) {
			logger.error("missing settings payload from magewell device");
			return false;
		}
		const parsedPayload = {};
		parsedPayload["name"] = payload["name"];
		parsedPayload["use-nosignal-file"] = payload["use-nosignal-file"];
		parsedPayload["nosignal-files"] = payload["nosignal-files"];
		parsedPayload["enable-deinterlace"] = payload["enable-deinterlace"];
		parsedPayload["deinterlace-mode"] = payload["deinterlace-mode"];
		parsedPayload["video-field"] = payload["video-field"];
		parsedPayload["main-stream"] = payload["main-stream"];
		parsedPayload["sub-stream"] = payload["sub-stream"];
		parsedPayload["audio"] = payload["audio"];
		parsedPayload["audio-stream-count"] = payload["audio-stream-count"];
		parsedPayload["audio-streams"] = payload["audio-streams"];
		parsedPayload["stream-server"] = payload["stream-server"];

		await mongoSingle.set("settings",
			parsedPayload
			, 60);

		logger.debug(`fetched and saved settings payload`);
		return true;
	} catch (error) {
		logger.error(`settings polling failed: ${error.message}`);
		throw error;
	}
};
