'use strict';

const mongoCollection = require('@core/mongo-collection');

module.exports = async () => {

    const vlanCollection = await mongoCollection("vlans");
    const vlanDocument = await vlanCollection.findOne({ "type": "vlans" });

    return vlanDocument?.vlans;
}

