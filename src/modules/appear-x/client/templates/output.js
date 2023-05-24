export default function output(data) {
    return {
        slot: data?.slot,
        key: data?.key,
        value: {
            label: data?.label,
            enabled: false,
            transportSettings: {
                udp: {
                    settings: {
                        dscp: 26,
                        ttl: 64,
                        rtp: true,
                        ts: {
                            value: {
                                mpegPacketsPerFrame: 7,
                            },
                        },
                        l2tpv3: {},
                        vlanPriority: {},
                    },
                    output: {
                        single: {
                            interfaceId: data?.interfaceId,
                            destination: {
                                address: "239.0.0.0",
                                port: 6000,
                            },
                            sourceAddressEnabled: false,
                            sourceAddress: "",
                            sourcePortEnabled: false,
                            sourcePort: 0,
                            fecEnabled: false,
                            fec: {},
                        },
                    },
                },
            },
            outputSettings: {
                tsWhitelistMode: {
                    dvbMode: {
                        orgNetworkId: {},
                        settings: {
                            tsId: 1,
                            bitrate: {},
                        },
                        source: {
                            multiplex: [
                                {
                                    service: {
                                        source: data?.sourceId,
                                        inputRedundancy: {
                                            mode: "Disabled",
                                            backups: [],
                                            preferredSource: {},
                                            switchbackDelay: 10,
                                            hotStandby: {},
                                        },
                                        priority: 0,
                                        settings: {
                                            serviceId: {},
                                            serviceName: {},
                                            serviceType: {},
                                            serviceProvider: {},
                                            componentLayout: {
                                                defaultAction: "PASSTHROUGH",
                                                layout: [],
                                            },
                                            pmtPid: {},
                                            componentGeneration: [],
                                            descriptors: [],
                                            scramblingIndex: {},
                                        },
                                    },
                                },
                            ],
                        },
                    },
                },
            },
            additionalFeatures: {},
        },
    };
}
