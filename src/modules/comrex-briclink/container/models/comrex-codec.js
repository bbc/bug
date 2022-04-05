"use strict";

exports.parseList = function (xml) {
    // pass in a list like this:
    // <codecList>
    //     <codec code="D1" delay="69" descr="This encoder provides excellent quality audio over a relatively high data rate. It should be used by those concerned about audio quality on networks with high immunity to congestion." id="audio/mpeg4-generic; TIAS=64000; rate=48000; channels=1; bitrate=64000; config=1188; indexDeltaLength=3; indexLength=3; mode=AAC-hbr; object=2; profile-level-id=41; sizeLength=13; streamtype=5" licensed="true" mode="AAC" name="Mono 64Kb" quality="95" rate="64"/>
    //     <codec code="D2" delay="69" descr="This encoder provides excellent quality audio over a relatively high data rate. It should be used by those concerned about audio quality on networks with high immunity to congestion. Audio channels should be correlated in this mode." id="audio/mpeg4-generic; TIAS=96000; rate=48000; channels=2; bitrate=96000; config=1190; indexDeltaLength=3; indexLength=3; mode=AAC-hbr; object=2; profile-level-id=41; sizeLength=13; streamtype=5" licensed="true" mode="AAC" name="Stereo 96Kb" quality="90" rate="96"/>
    // </codecList>

    const results = [];
    if (xml?.children?.[0]?.name === "codecList") {
        for (const codec of xml?.children?.[0]?.children) {
            // copy the profile attributes
            results.push({ ...codec.attributes });
        }
        return results;
    }
    return false;
};
