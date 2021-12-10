---
layout: page
title: Status Handling
parent: Development
nav_order: 2
---

# Status Handling

Modules should implement a status endpoint. This is used by Bug core to generate the coloured Alerts on the home page and toolbar.

It should be located at
`/container/yourpanelid/status`
and have the following response:

When working:

When there are problems:

```
{
  "status": "success",
  "data": [
    {
      "key": "staleleasesdata",
      "message": [
        "There is no recent router data for this device.",
        "Check your connection and authentication settings."
      ],
      "type": "critical",
      "timestamp": 1638349987832,
      "flags": [
        "restartPanel",
        "configurePanel"
      ]
    }
  ]
}
```

The following fields should be included:
| name | description |
| --------- | ----------- |
| key | A unique key - can be anything |
| message | An array containing messages to be displayed in the alert. The first line will always be displayed |
| type | one of info/warning/error/critical - note that a critical error will make the panel unavailable for use
| timestamp | a javascript timestamp when the alert was generated
| flags | An array including any of: restartPanel/configurePanel - these will show an appropriate action button the alert |

There is a helper class which will validate and assist you when creating this response:

You can use it like this:

```
const StatusItem = require("@core/StatusItem");
module.exports = async () => {
    ... your logic code here ....
    if (!result) {
        return [
            new StatusItem({
                key: `errorresult`,
                message: [`Device has an unspecified error`],
                type: "warning",
            }),
        ];
    }
    return [];
};
```
