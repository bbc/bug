import BugApiSelect from "@core/BugApiSelect";

export default {
    title: "BUG Core/API Controls/BugApiSelect",
    component: BugApiSelect,
    parameters: {
        docs: {
            description: {
                component: `A dropdown which is designed for use with an API.<br />
                Triggers the onChange event, and disables the control to allow the new value to be updated.<br />
                If the value hasn't changed within the timeout period the control is re-enabled.<br />
                Takes an options array - which should contain objects with id and label properties.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    decorators: [(Story) => <div style={{ margin: "1em", maxWidth: "300px" }}>{Story()}</div>],

    argTypes: {
        disabled: {
            type: { name: "boolean" },
            defaultValue: false,
            description: "Whether the control is disabled",
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
        onChange: {
            type: { name: "function", required: true },
            defaultValue: null,
            description: "This callback is called when the selection is changed. Passes the event object",
            control: {
                disable: true,
            },
            table: {
                type: { summary: "function" },
                defaultValue: { summary: null },
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
            type: { name: "function", required: false },
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
            description: "The MUI variant of the control.",
            defaultValue: "standard",
            control: { type: "select" },
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "standard" },
            },
        },
        timeout: {
            type: { name: "number" },
            description: "Duration to wait (in milliseconds) before reverting to previous state",
            defaultValue: 5000,
            table: {
                type: { summary: "number" },
                defaultValue: { summary: 5000 },
            },
        },
    },
};

export const MyApiButton = (args) => (
    <BugApiSelect
        {...args}
        onChange={() => {
            alert("thank you!");
        }}
    >
        Click Me!
    </BugApiSelect>
);
MyApiButton.displayName = "BugApiSelect";
MyApiButton.storyName = "BugApiSelect";
