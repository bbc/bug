import BugSelect from "@core/BugSelect";

export default {
    title: "BUG Core/Controls/BugSelect",
    component: BugSelect,
    parameters: {
        docs: {
            description: {
                component: `A simple select dropdown with BUG styling. Items are passed as a javascript object.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    decorators: [(Story) => <div style={{ margin: "1em", maxWidth: "600px" }}>{Story()}</div>],

    argTypes: {
        disabled: {
            type: { name: "boolean" },
            defaultValue: false,
            description: "Whether to disable the control",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: false },
            },
        },
        fullWidth: {
            type: { name: "boolean" },
            defaultValue: true,
            description: "Expands the control to fill available horizontal space",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: true },
            },
        },
        options: {
            type: { name: "data", required: true },
            description: "An object array of available values. Each item must have an id and a label property.",
            defaultValue: [
                { id: "zebra", label: "Zebra" },
                { id: "caterpillar", label: "Caterpillar" },
                { id: "horse", label: "Horse" },
            ],
            table: {
                type: { summary: "data" },
                defaultValue: { summary: null },
            },
        },
        renderItem: {
            type: { name: "function", required: true },
            description:
                "An optional callback function to render each item. Passes the item object (containing ID and label properties) as the first argument.",
            control: {
                disable: true,
            },
            table: {
                type: { summary: "data" },
                defaultValue: { summary: null },
            },
        },
        value: {
            type: { name: "data", required: false },
            defaultValue: "zebra",
            description:
                "The selected value when the control is loaded. This should be a valid ID listed in the options array.",
            table: {
                type: { summary: "data" },
                defaultValue: { summary: null },
            },
        },
        variant: {
            options: ["filled", "outlined", "standard"],
            description: "The MUI variant of the button.",
            defaultValue: "outlined",
            control: { type: "select" },
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "outlined" },
            },
        },
    },
};

export const MyBugSelect = (args) => <BugSelect {...args} />;

MyBugSelect.displayName = "BugSelect";
MyBugSelect.storyName = "BugSelect";
