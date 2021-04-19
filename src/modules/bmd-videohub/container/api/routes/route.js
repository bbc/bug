const express = require('express');
const videohub = require('../utils/videohub')
const route = express.Router();

route.get('/:input/:output', async function (req, res, next) {
    try {
        videohub.route(req.params?.input, req.params?.output);
        res.json({
            status: "success",
            data: await configGet()
        });
    } catch (error) {
        res.json({ 
            status: "error",
            message: "Failed to fetch panel config" 
        });
    }
});

module.exports = route;
