const handleAddressChanged = (mac, address) => {
    // allow empty mac or check for the specific prefix
    const isOverwritable = !mac || mac.startsWith("02:00:00");

    // guard clause: ensure address exists and mac is overwritable
    if (!address || !isOverwritable) {
        return mac;
    }

    // standard ipv4 regex
    const ipv4Regex = /^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$/;

    if (ipv4Regex.test(address)) {
        const ipArray = address.split(".");

        // ensure we are padding to 3 digits to avoid index errors
        const thirdOctet = ipArray[2].padStart(3, "0");
        const fourthOctet = ipArray[3].padStart(3, "0");

        // constructing the mac: 02:00:00:xx:xx:xx
        const newMac = [
            "02:00:00",
            `${thirdOctet[0]}${thirdOctet[1]}`,
            `${thirdOctet[2]}${fourthOctet[0]}`,
            `${fourthOctet[1]}${fourthOctet[2]}`
        ].join(":");

        return newMac.toUpperCase(); // macs are traditionally uppercase
    }

    return mac;
};

export default handleAddressChanged;