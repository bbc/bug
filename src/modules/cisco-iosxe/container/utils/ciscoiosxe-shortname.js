"use strict";

module.exports = (interfaceLabel) => {
    const speeds = {
        FastEthernet: "Fa",
        FiftyGigabitEthernet: "Fi",
        FortyGigabitEthernet: "Fo",
        FourHundredGigabitEthernet: "F",
        GigabitEthernet: "Gi",
        HundredGigabitEthernet: "Hu",
        TenGigabitEthernet: "Te",
        TwoHundredGigabitEthernet: "TH",
    };

    return speeds?.[interfaceLabel];
};
