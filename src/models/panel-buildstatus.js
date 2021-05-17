'use strict';

const logger = require('@utils/logger')(module);
const mongoCollection = require("@core/mongo-collection");

//TODO error handling with throw

exports.get = async function(panelId) {
    try {
        const panelBuildStatusCollection = await mongoCollection("panelbuildstatus");
        const result = await panelBuildStatusCollection.findOne({"panelid": panelId});
        if(result) {
            return result['status'];
        }

    } catch (error) {
        logger.warning(`${error.trace || error || error.message}`);
    }
    return null;
}

exports.set = async function(panelId, statusText, progress) {
    try {
        const panelBuildStatusCollection = await mongoCollection("panelbuildstatus");
        await panelBuildStatusCollection.updateOne(
            {
                "panelid": panelId
            },{
                "$set": {
                    "panelid": panelId,
                    "status": {
                        text: statusText,
                        progress,
                        error: false
                    }
                }
            },{
                "upsert": true
            }
        );
        return true;
    } catch (error) {
        logger.warning(`${error.trace || error || error.message}`);
        return false;
    }
}

exports.setError = async function(panelId, errorText) {
    try {
        const panelBuildStatusCollection = await mongoCollection("panelbuildstatus");
        await panelBuildStatusCollection.updateOne(
            {
                "panelid": panelId
            },{
                "$set": {
                    "panelid": panelId,
                    "status": {
                        text: errorText,
                        progress: -1,
                        error: true
                    }
                }
            },{
                "upsert": true
            }
        );
        return true;
    } catch (error) {
        logger.warning(`${error.trace || error || error.message}`);
        return false;
    }
}

exports.setProgress = async function(panelId, progress) {
    try {
        const panelBuildStatusCollection = await mongoCollection("panelbuildstatus");
        await panelBuildStatusCollection.updateOne(
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
        logger.warning(`${error.trace || error || error.message}`);
        return false;
    }
}

exports.list = async function() {
    try {
        const panelBuildStatusCollection = await mongoCollection("panelbuildstatus");
        const response = [];
        const result = await panelBuildStatusCollection.find().toArray();
        for(var eachResult of result) {
            response.push({
                'panelid': eachResult['panelid'],
                'status': eachResult['status'],
            });
        }
        return response;

    } catch (error) {
        logger.warning(`${error.trace || error || error.message}`);
    }
    return null;

}