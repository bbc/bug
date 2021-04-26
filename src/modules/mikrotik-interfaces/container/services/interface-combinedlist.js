const mongoCollection = require('../utils/mongo-collection');

module.exports = async () => {

    const dbInterfaces = await mongoCollection('interfaces');
    let interfaces = await dbInterfaces.find().toArray();
    if(!interfaces) {
        return null;
    }

    const dbLinkStats = await mongoCollection('linkstats');
    let linkStats = await dbLinkStats.find().toArray();
    const linkStatsByName = [];
    for(let eachLinksStat of linkStats) {
        linkStatsByName[eachLinksStat['name']] = eachLinksStat;
    }

    const dbTraffic = await mongoCollection('traffic');
    let traffic = await dbTraffic.find().toArray();
    const trafficByName = [];
    for(let eachInterface of traffic) {
        trafficByName[eachInterface['name']] = eachInterface;
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

