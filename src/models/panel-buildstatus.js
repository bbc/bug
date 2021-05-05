'use strict';

const logger = require('@utils/logger')(module);
const Db = require('@utils/db');

//TODO error handling with throw

const connect = async () => {
    const dbClass = new Db();
    const db = await dbClass.connect();
    if(!db) {
        logger.warn("could not connect to database");
        return false;
    }
    return db;
}

exports.get = async function(panelId) {
    try {
        const db = await connect();
        if(!db) {
            return null;
        }

        const result = await db.collection('panelstatus').findOne({"panelid": panelId});
        if(result) {
            return result['status'];
        }

    } catch (error) {
        logger.warn(`${error.trace || error || error.message}`);
    }
    return null;
}

exports.set = async function(panelId, statusText, progress) {
    try {
        const db = await connect();
        if(!db) {
            return false;
        }

        await db.collection('panelstatus').updateOne(
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
        logger.warn(`${error.trace || error || error.message}`);
        return false;
    }
}

exports.setError = async function(panelId, errorText) {
    try {
        let db = await connect();
        if(!db) {
            return false;
        }

        await db.collection('panelstatus').updateOne(
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
        logger.warn(`${error.trace || error || error.message}`);
        return false;
    }
}

exports.setProgress = async function(panelId, progress) {
    try {
        const db = await connect();
        if(!db) {
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
        logger.warn(`${error.trace || error || error.message}`);
        return false;
    }
}

exports.list = async function() {
    try {
        const db = await connect();
        if(!db) {
            return null;
        }

        const response = [];
        const result = await db.collection('panelstatus').find().toArray();
        for(var eachResult of result) {
            response.push({
                'panelid': eachResult['panelid'],
                'status': eachResult['status'],
            });
        }
        return response;

    } catch (error) {
        logger.warn(`${error.trace || error || error.message}`);
    }
    return null;

}