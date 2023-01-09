import React from "react";
import BugTrafficChart from "@core/BugTrafficChart";

export default {
    title: "BUG Core/Controls/BugTrafficChart",
    component: BugTrafficChart,
    parameters: {
        docs: {
            description: {
                component: `A traffic chat with time-based navigation controls.<br />
                Pass in a URL to the API endpoint to fetch the data.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    decorators: [(Story) => <div style={{ margin: "1em" }}>{Story()}</div>],

    argTypes: {
        sx: {
            type: { name: "data" },
            defaultValue: {},
            description:
                "An object containing style overrides - see MaterialUI docs for options: https://mui.com/system/getting-started/the-sx-prop/",
            table: {
                type: { summary: "data" },
                defaultValue: { summary: "{}" },
            },
        },
        url: {
            type: { name: "string", required: true },
            defaultValue: "/container/${panelId}/interface/history/${interfaceId}",
            description:
                "This the URL to the API endpoint to fetch the data. A start and end timestamp (in ms) is appended to the URL.",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: null },
            },
        },
        mockApiData: {
            table: { disable: true },
        },
    },
};

export const MyBugTrafficChart = (args) => {
    const fakeTraffic = [];
    for (let i = Date.now() - 700000; i < Date.now(); i += 12000) {
        fakeTraffic.push({
            timestamp: i,
            tx: Math.floor(Math.random() * 10000000) + 10000000,
            rx: Math.floor(Math.random() * 10000000) + 6000000,
        });
    }
    return <BugTrafficChart mockApiData={fakeTraffic} />;
};

MyBugTrafficChart.displayName = "BugTrafficChart";
MyBugTrafficChart.storyName = "BugTrafficChart";
MyBugTrafficChart.parameters = {
    docs: {
        source: {
            code: `
<BugTrafficChart
    url="/container/\${panelId}/interface/history/\${interfaceId}"
/>
`,
        },
    },
};
