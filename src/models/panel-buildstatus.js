'use strict';

const logger = require('@utils/logger');
const Db = require('@utils/db');

exports.get = async function(panelId) {
    try {
        var dbClass = new Db();
        var db = await dbClass.connect();
        if(!db) {
            logger.warn("panel-buildstatus: could not connect to database");
            return null;
        }

        var result = await db.collection('panelstatus').findOne({"panelid": panelId});
        if(result) {
            return result['status'];
        }

    } catch (error) {
        logger.warn(`panel-buildstatus: ${error.trace || error || error.message}`);
    }
    return null;
}

exports.set = async function(panelId, status) {
    try {
        var dbClass = new Db();
        var db = await dbClass.connect();
        if(!db) {
            logger.warn("panel-buildstatus: could not connect to database");
            return false;
        }

        await db.collection('panelstatus').updateOne(
            {
                "panelid": panelId
            },{
                "$set": {
                    "panelid": panelId,
                    "status": status
                }
            },{
                "upsert": true
            }
        );
        return true;
    } catch (error) {
        logger.warn(`panel-buildstatus: ${error.trace || error || error.message}`);
        return false;
    }
}

exports.setProgress = async function(panelId, progress) {
    try {
        var dbClass = new Db();
        var db = await dbClass.connect();
        if(!db) {
            logger.warn("panel-buildstatus: could not connect to database");
            return false;
        }

        await db.collection('panelstatus').updateOne(
            {
                "panelid": panelId
            },{
                "$set": {
                    "status.progress": progress
                }
            },{
                "upsert": false
            }
        );
        return true;
    } catch (error) {
        logger.warn(`panel-buildstatus: ${error.trace || error || error.message}`);
        return false;
    }
}

exports.list = async function() {
}