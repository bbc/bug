"use strict";

const parseCodecParameters = (parameters) => {
    // looks something like this:
    // <local codec="audio/mpeg4-generic; TIAS=48000; rate=48000; channels=1; bitrate=48000; config=2b098800; indexDeltaLength=3; indexLength=3; mode=AAC-hbr; object=5; profile-level-id=44; sizeLength=13; streamtype=5" />

    let result = {};
    if (parameters) {
        const paramArray = parameters.split("; ");
        for (const paramElement of paramArray) {
            result["name"] = paramArray[0];
            const elementArray = paramElement.split("=");
            if (elementArray.length === 2) {
                result[elementArray[0]] = elementArray[1];
            }
        }
        result = {
            ...result,
            TIAS: parseInt(result?.TIAS),
            rate: parseInt(result?.rate),
            channels: parseInt(result?.channels),
            bitrate: parseInt(result?.bitrate),
            indexDeltaLength: parseInt(result?.indexDeltaLength),
            indexLength: parseInt(result?.indexLength),
            object: parseInt(result?.object),
            "profile-level-id": parseInt(result?.["profile-level-id"]),
            sizeLength: parseInt(result?.sizeLength),
            streamtype: parseInt(result?.streamtype),
        };
    }
    return result;
};

exports.parseList = function (xml) {
    // pass in a load of these:
    //    <profile default="false" id="-14">
    //       <settings channel="rtp_udp_mux" factory="true" name="HE-AAC Mono" visible="true" />
    //       <local codec="audio/mpeg4-generic; TIAS=48000; rate=48000; channels=1; bitrate=48000; config=2b098800; indexDeltaLength=3; indexLength=3; mode=AAC-hbr; object=5; profile-level-id=44; sizeLength=13; streamtype=5" />
    //       <remote codec="!follow" />
    //    </profile>

    const results = [];
    if (xml?.children?.[0]?.name === "profileList") {
        // console.log("profilelist");
        for (const profile of xml?.children?.[0]?.children) {
            // copy the profile attributes
            const parsedProfile = {
                ...profile.attributes,
                default: profile?.attributes?.default === "true",
                id: parseInt(profile?.attributes?.id),
            };

            // then loop through the children
            for (const child of profile.children) {
                if (child.name === "settings") {
                    parsedProfile["settings"] = {
                        ...child.attributes,
                        visible: child?.attributes?.visible === "true",
                    };
                } else {
                    parsedProfile[child.name] = { ...child.attributes };
                }
            }

            // parse the codec details
            parsedProfile.local.codec = parseCodecParameters(parsedProfile["local"]?.["codec"]);
            parsedProfile.remote.codec = parseCodecParameters(parsedProfile["remote"]?.["codec"]);

            // we're done - add it to the array
            results.push(parsedProfile);
        }
        return results;
    }
    return false;
};
