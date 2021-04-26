const mongoCollection = require('../utils/mongo-collection');

module.exports = async (interfaceId) => {

    const dbInterfaces = await mongoCollection('interfaces');
    let interface = await dbInterfaces.findOne({'id': interfaceId});
    console.log(interface);
    if(!interface) {
        return null;
    }

    const dbLinkStats = await mongoCollection('linkstats');
    const linkStats = await dbLinkStats.findOne({'id': interfaceId});

    const dbTraffic = await mongoCollection('traffic');
    const traffic = await dbTraffic.findOne({'id': interfaceId});

    interface['linkstats'] = linkStats;
    interface['traffic'] = traffic;

    return interface;
}

