import BugSparkCell from "@core/BugSparkCell";

export default {
    title: "BUG Core/Controls/BugSparkCell",
    component: BugSparkCell,
    parameters: {
        docs: {
            description: {
                component: `A sparkline control for use in a BugApiTable cell`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    decorators: [(Story) => <div style={{ margin: "1em", maxWidth: "300px" }}>{Story()}</div>],

    argTypes: {
        height: {
            type: { name: "string", required: false },
            defaultValue: "50px",
            description: "The height of the sparkline. Accepts any valid CSS unit.",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "100%" },
            },
        },
        history: {
            type: { name: "data", required: true },
            defaultValue: [
                { timestamp: "2022-02-09T09:58:11.635Z", value: 0 },
                { timestamp: "2022-02-09T09:58:14.468Z", value: 10 },
                { timestamp: "2022-02-09T09:58:15.468Z", value: 20 },
                { timestamp: "2022-02-09T09:58:16.468Z", value: 3 },
                { timestamp: "2022-02-09T09:58:17.212Z", value: 5 },
                { timestamp: "2022-02-09T09:58:19.961Z", value: 25 },
            ],
            description:
                "An array of data points to display. Each data point should contain timestamp (Javascript time object) and value (number) properties.",
            table: {
                type: { summary: "data" },
                defaultValue: { summary: "[]" },
            },
        },
        value: {
            type: { name: "string", required: false },
            defaultValue: "10 Mbps",
            description: "A text value to display over the sparkline",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: null },
            },
        },
    },
};

export const MyBugSparkCell = (args) => <BugSparkCell {...args} />;

MyBugSparkCell.displayName = "BugSparkCell";
MyBugSparkCell.storyName = "BugSparkCell";
