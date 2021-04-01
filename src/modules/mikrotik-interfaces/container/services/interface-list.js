const db = require('../utils/db');

module.exports = async () => {

    const dbLinkStats = await db('linkstats');
    let linkStats = await dbLinkStats.find();
    const linkStatsByName = [];
    for(let eachLinksStat of linkStats) {
        linkStatsByName[eachLinksStat['name']] = eachLinksStat;
    }

    const dbTraffic = await db('traffic');
    let traffic = await dbTraffic.find();
    const trafficByName = [];
    for(let eachInterface of traffic) {
        trafficByName[eachInterface['name']] = eachInterface;
    }

    const dbInterfaces = await db('interfaces');
    let interfaces = await dbInterfaces.find();
    if(!interfaces) {
        return null;
    }

    interfaces.sort((a, b) => (a.name > b.name) ? 1 : -1)
    for(eachInterface of interfaces) {
        // add link stats
        if(eachInterface['name'] in linkStatsByName) {
            eachInterface['linkstats'] = linkStatsByName[eachInterface['name']];
        }
        else {
            eachInterface['linkstats'] = [];
        }

        // add traffic
        if(eachInterface['name'] in trafficByName) {
            eachInterface['traffic'] = trafficByName[eachInterface['name']];
        }
        else {
            eachInterface['traffic'] = [];
        }

    }
    return interfaces;
}

