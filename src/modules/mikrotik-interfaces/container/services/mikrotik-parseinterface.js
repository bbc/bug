'use strict';

module.exports = async (iface) => {
    const integerFields = [
        'mtu',
        'actual-mtu',
        'l2mtu',
        'max-l2mtu',
        'link-downs',
        'rx-byte',
        'tx-byte',
        'rx-packet',
        'tx-packet',
        'rx-drop',
        'tx-drop',
        'tx-queue-drop',
        'tx-error',
        'rx-error',
        'fp-rx-byte',
        'fp-tx-byte',
        'fp-rx-packet',
        'fp-tx-packet'
    ];

    const booleanFields = [
        'running',
        'slave',
        'disabled'
    ];

    for (var i in integerFields) {
        if (integerFields[i] in iface) {
            iface[integerFields[i]] = parseInt(iface[integerFields[i]]) ?? 0;
        }
    }
    for (var i in booleanFields) {
        if (booleanFields[i] in iface) {
            iface[booleanFields[i]] = (iface[booleanFields[i]] === 'true');
        }
    }
    // overwrite '.id' field with 'id'
    iface['id'] = iface['.id'];
    delete iface['.id'];

    // add timestamp
    iface['timestamp'] = Date.now();
    return iface;
};

