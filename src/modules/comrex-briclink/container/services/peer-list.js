"use strict";

const mongoSingle = require("@core/mongo-single");

// can_connect:
//     (none) = navigation (group)
//     normal = manually added entry
//     lan    = Traversal server (locally available)
//     ts     = Traversal server (normal)
//     ts_punch = Traversal server (normal)
//     busy   = Traversal server (busy)

// autocon is whether it has already automatically reconnected, not whether it should

module.exports = async () => {
    const peerList = await mongoSingle.get("peerList");
    const profileList = await mongoSingle.get("profileList");
    const sysOptions = await mongoSingle.get("sysOptions");
    const defaultProfile = profileList.find((profile) => profile.default === true);
    const isAnyPeerConnected = peerList.filter((peer) => peer.chan_state === "Connected").length > 0;
    return peerList.map((peer) => {
        const profile = (() => {
            if (peer.profile === 0) {
                return defaultProfile;
            } else {
                return profileList.find((profile) => profile.id === peer.profile);
            }
        })();
        const isConnected = peer.chan_state === "Connected";
        const autoConnectEnabled = sysOptions.always_on_peer === peer.id;
        const type = (() => {
            switch (peer.can_connect) {
                case "":
                    return "navigation";
                case "normal":
                    return "manual";
                case "lan":
                    return "ts";
                case "ts":
                    return "ts";
                case "ts_punch":
                    return "ts";
                case "busy":
                    return "ts";
                default:
                    return "unknown";
            }
        })();

        return {
            ...peer,
            _connected: isConnected,
            _profileName: profile ? profile.settings.name : "",
            _tx_codec: isConnected && profile ? profile.settings.name : "",
            _canConnect: !isConnected && !isAnyPeerConnected,
            _type: type,
            _busy: peer.can_connect === "busy",
            _autoConnectEnabled: autoConnectEnabled,
            _active: isConnected,
        };
    });
};
