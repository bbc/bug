'use strict';

const mongoCollection = require('@core/mongo-collection');

module.exports = async (interfaceName) => {

    const dbInterfaces = await mongoCollection('interfaces');
    let iface = await dbInterfaces.findOne({'name': interfaceName});

    if(!iface) {
        return null;
    }

    const interfaceId = iface.id;
    
    const dbLinkStats = await mongoCollection('linkstats');
    const linkStats = await dbLinkStats.findOne({'name': interfaceName});

    const dbTraffic = await mongoCollection('traffic');
    const traffic = await dbTraffic.findOne({'name': interfaceName});

    iface['linkstats'] = linkStats;
    iface['traffic'] = traffic;

    return iface;
}

