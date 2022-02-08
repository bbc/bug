import BugGauge from "../core/BugGauge";

export default {
    title: "BUG Core/Controls/BugGauge",
    component: BugGauge,
    parameters: {
        docs: {
            description: {
                component: `A gauge control which can be used in a BUG module to display temperature, disk space, etc.`,
            },
        },
    },

    decorators: [(Story) => <div style={{ margin: "1em", maxWidth: "300px" }}>{Story()}</div>],

    argTypes: {
        title: {
            type: { name: "string" },
            defaultValue: "Bug Gauge",
            description: "Title to be displayed at the top of the control",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "" },
            },
        },
        value: {
            type: { name: "number" },
            description: "Value of the gauge",
            defaultValue: 50,
            table: {
                type: { summary: "number" },
                defaultValue: { summary: 0 },
            },
            control: {
                type: "number",
            },
        },
        max: {
            type: "number",
            description: "Maximum value of the gauge",
            defaultValue: 100,
            table: {
                type: { summary: "number" },
                defaultValue: { summary: 100 },
            },
            control: {
                type: "number",
            },
        },
        unit: {
            type: { name: "string" },
            description: "The unit string to be displayed after the value, eg. %",
            defaultValue: "%",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "%" },
            },
        },
        decimalPlaces: {
            type: "number",
            description: "The number of decimal places to be displayed",
            defaultValue: 2,
            table: {
                type: { summary: "number" },
                defaultValue: { summary: 2 },
            },
            control: {
                type: "number",
            },
        },
    },
};

export const MyBugGauge = (args) => <BugGauge {...args} />;
MyBugGauge.displayName = "MyBugGauge";
MyBugGauge.value = 50;
MyBugGauge.storyName = "BugGauge";
