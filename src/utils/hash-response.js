"use strict";

const md5 = require("md5");

module.exports = (res, req, contents) => {
    const response = contents;
    const meta = {
        hash: md5(response),
        userId: req?.user,
        request_url: `${req.protocol}://'${req.hostname}${req.originalUrl}`,
        request_method: req.method,
        request_body: req.body,
    };

    response.meta = meta;
    res.json(response);
};
