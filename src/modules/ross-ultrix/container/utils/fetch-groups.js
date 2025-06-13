"use strict";
const ultrixWebApi = require("./ultrix-webapi");
const mongoSingle = require("@core/mongo-single");

module.exports = async ({ address, uiPort }) => {

    const sourceNames = await mongoSingle.get("sources");
    const destinationNames = await mongoSingle.get("destinations");

    if (!sourceNames || !destinationNames) {
        console.log(`fetch-groups: no source or destination names yet - waiting`);
        return false
    }

    const response = await ultrixWebApi.get("groupcategory/agdatassds", { address, uiPort });

    let groups = [];

    // check the top level is called "GroupCategories"
    if (response?.[0]?.Name === "GroupCategories") {

        // the groups API endpoint doesn't return the actual button index - just the name - which is luckily unique.
        groups = response?.[0]?.Children.filter((c) => c.Type === 1).map((n) => {
            return {
                id: n.Id,
                name: n.Name,
                sources: n.Children?.filter((c) => c.Type === 3).map((s) =>
                    sourceNames.find((sn) => sn.name === s.Name)?.uiId
                ),
                destinations: n.Children?.filter((c) => c.Type === 2).map((d) =>
                    destinationNames.find((dn) => dn.name === d.Name)?.uiId
                )
            }
        });
    }

    // save to db
    await mongoSingle.set("groups", groups, 60);
};


