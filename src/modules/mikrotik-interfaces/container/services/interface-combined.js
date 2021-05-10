const mongoCollection = require('../utils/mongo-collection');

module.exports = async (interfaceName) => {

    const dbInterfaces = await mongoCollection('interfaces');
    let interface = await dbInterfaces.findOne({'name': interfaceName});

    if(!interface) {
        return null;
    }

    const interfaceId = interface.id;
    
    const dbLinkStats = await mongoCollection('linkstats');
    const linkStats = await dbLinkStats.findOne({'name': interfaceName});

    const dbTraffic = await mongoCollection('traffic');
    const traffic = await dbTraffic.findOne({'name': interfaceName});

    interface['linkstats'] = linkStats;
    interface['traffic'] = traffic;

    return interface;
}

