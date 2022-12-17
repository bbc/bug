"use strict";

module.exports = (data, listName) => {
    const dataLines = data.split(";");
    const returnArray = {};

    let foundList = false;
    let listArray = [];

    if (dataLines && Array.isArray(dataLines)) {
        for (const eachItem of dataLines) {
            if (eachItem.indexOf(`var ${listName} = document.getElementById(`) === 0) {
                if (foundList) {
                    // we've done this once - we're done
                    break;
                }
                foundList = true;
            }
            if (foundList) {
                if (eachItem.indexOf(`obj.text = '`) === 0) {
                    const nameValue = eachItem.split(" = ");
                    if (nameValue && nameValue.length === 2) {
                        let value = nameValue[1];
                        if (value.startsWith("'") && value.endsWith("'")) {
                            value = value.substring(1);
                            value = value.substring(0, value.length - 1);
                        }

                        listArray.push(value);
                    }
                }
            }
        }
    }

    return listArray;
};
