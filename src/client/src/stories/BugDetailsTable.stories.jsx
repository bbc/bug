import BugDetailsTable from "@core/BugDetailsTable";

export default {
    title: "BUG Core/Layout/BugDetailsTable",
    component: BugDetailsTable,
    parameters: {
        docs: {
            description: {
                component: `A card control for displaying name/value-style content in a card.<br />
                Uses a BugDetailsTable to display the content`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    decorators: [
        (Story) => <div style={{ margin: "1em", backgroundColor: "#262626", maxWidth: "300px" }}>{Story()}</div>,
    ],

    argTypes: {
        width: {
            type: { name: "string", required: false },
            defaultValue: "10rem",
            description: "The width of the card - can be in any valid CSS unit",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "10rem" },
            },
        },
        items: {
            type: { name: "data", required: true },
            defaultValue: [
                { name: "Voltage 1", value: "12.3 V" },
                { name: "Voltage 2", value: "12.3 V" },
            ],
            description:
                "An array of objects with name and value properties to display in the card. The value can be a string, or a React component",
            table: {
                type: { summary: "data" },
                defaultValue: { summary: "[]" },
            },
        },
        gridLines: {
            type: { name: "boolean", required: false },
            defaultValue: true,
            description: "Whether to show grid lines between each row",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: true },
            },
        },
    },
};

export const MyBugDetailsTable = (args) => <BugDetailsTable {...args} />;

MyBugDetailsTable.displayName = "BugDetailsTable";
MyBugDetailsTable.storyName = "BugDetailsTable";
