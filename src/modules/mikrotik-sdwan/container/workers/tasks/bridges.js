"use strict";

module.exports = async ({ conn, mongoSingle }) => {

    try {
        if (!conn) {
            throw new Error("no connection provided");
        }

        const data = await conn.write("/interface/bridge/print");

        // if the response isn't an array, the router likely returned an error or timed out
        if (!data || !Array.isArray(data)) {
            throw new Error("invalid response from router");
        }
        const result = data.map((item) => {
            return {
                "id": item[".id"],
                "name": item.name,
                "dynamic": item.dynamic === "true",
                "running": item.running === "true",
                "disabled": item.disabled === "true",
                "comment": item.comment
            }
        });

        console.log(`bridges: found ${result.length} bridge(s) - saving to db`);
        await mongoSingle.set("bridges", result, 60);
        return true;

    } catch (error) {
        // log and re-throw so the worker loop triggers a thread restart
        console.error(`bridges: ${error.message}`);
        throw error;
    }
};