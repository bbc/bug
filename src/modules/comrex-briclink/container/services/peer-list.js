"use strict";

const mongoSingle = require("@core/mongo-single");
const peerIsConnected = require("@services/peer-isconnected");

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

    if (!peerList) {
        return [];
    }

    const profileList = await mongoSingle.get("profileList");
    const sysOptions = await mongoSingle.get("sysOptions");
    const defaultProfile = profileList && profileList.find((profile) => profile.default === true);

    const isAnyPeerConnected = await peerIsConnected();

    let connectedPeerIsVisible = false;

    const mappedPeerList = peerList.map((peer) => {
        const profile = (() => {
            if (peer.profile !== 0 && profileList) {
                return profileList.find((profile) => {
                    return profile.id === peer.profile;
                });
            }
            return defaultProfile;
        })();

        /// not sure selecting a new profile name is working tyet .....

        const isConnected = peer.chan_state === "Connected";
        const autoConnectEnabled = sysOptions?.always_on_peer === peer.id;
        if (peer.chan_state === "Connected" || peer.chan_state === "Requesting call") {
            connectedPeerIsVisible = true;
        }

        const type = (() => {
            if (peer.name === "<- Back") {
                return "back";
            }
            if (peer.can_connect === undefined && peer.stored === false && peer.name.endsWith("->")) {
                return "folder";
            }
            switch (peer.can_connect) {
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
                case "ts_fail":
                    return "ts";
                default:
                    return "unknown";
            }
        })();

        const peerState = (() => {
            if (type === "back" || type === "folder") {
                return "navigation";
            }
            if (isConnected) {
                return "connected";
            }
            if (peer.chan_state === "Local disconnect") {
                return "local_disconnect";
            }
            if (peer.chan_state === "Requesting call") {
                return "local_connect";
            }
            switch (peer.can_connect) {
                case "normal":
                    return "idle";
                case "lan":
                    return "idle";
                case "ts":
                    return "idle";
                case "ts_punch":
                    return "idle";
                case "busy":
                    return "busy";
                case "ts_fail":
                    return "error";
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
            _state: peerState,
        };
    });

    if (!connectedPeerIsVisible && isAnyPeerConnected) {
        // the connected peer isn't in this current page. We're going to add it ourselves - muhahahaha!
        const peerStats = await mongoSingle.get("peerStats");
        if (peerStats) {
            mappedPeerList.splice(0, 0, {
                active: false,
                addr: "",
                autoconn: false,
                backup: false,
                backup_id: 0,
                can_connect: "normal",
                chan_state: "",
                id: peerStats.id,
                incoming: false,
                name: peerStats.name,
                profile: 0,
                _connected: true,
                _profileName: "",
                _tx_codec: "",
                _canConnect: false,
                _type: "manual",
                _busy: false,
                _autoConnectEnabled: false,
                _active: false,
                _state: "connected",
            });
        }
    }

    // if there's a 'back' option, we put it at the start
    return mappedPeerList.sort((a, b) => (a._type !== "back" ? 1 : -1));
};
