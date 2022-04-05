"use strict";

exports.parse = function (xml) {
    // pass in one of these:
    // <sipProxy enabled="true" online="false" server="172.26.8.100" status="Registering" user="902"/>

    if (xml?.children?.[0]?.name === "sipProxy") {
        // copy the attributes
        return { ...xml?.children?.[0]?.attributes };
    }
    return false;
};
