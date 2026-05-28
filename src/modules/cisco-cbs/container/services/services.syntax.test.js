const path = require("path");

const serviceFiles = [
    "device-save.js",
    "device-setpending.js",
    "device-stackcount.js",
    "interface-disable.js",
    "interface-enable.js",
    "interface-get.js",
    "interface-getfdb.js",
    "interface-history.js",
    "interface-list.js",
    "interface-poe.js",
    "interface-protect.js",
    "interface-rename.js",
    "interface-setvlanaccess.js",
    "interface-setvlantrunk.js",
    "interface-unprotect.js",
    "pending-get.js",
    "status-checkpasswordexpired.js",
    "status-checkpending.js",
    "status-get.js",
    "status-getsystem.js",
    "subworker-interfacefdb.js",
    "subworker-interfacelldp.js",
    "traffic-savehistory.js",
    "validate-address.js",
    "validate-auth.js",
    "validate-snmp.js",
    "vlan-list.js",
];

describe("services syntax smoke", () => {
    test.each(serviceFiles)("loads %s", (file) => {
        const serviceModule = require(path.join(__dirname, file));
        expect(typeof serviceModule).toBe("function");
    });
});
