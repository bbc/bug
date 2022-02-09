import BugApiSaveButton from "@core/BugApiSaveButton";

export default {
    title: "BUG Core/API Controls/BugApiSaveButton",
    component: BugApiSaveButton,
    parameters: {
        docs: {
            description: {
                component: `A simple button which is designed for use with an API.<br />
                Triggers the onChange event, and disables the control to allow the new value to be updated.<br />
                If the value hasn't changed within the timeout period the control is re-enabled.<br />
                Can be used with a simple array of strings, or with a custom object with a label and value properties.`,
            },
        },
    },

    decorators: [(Story) => <div style={{ margin: "1em", maxWidth: "300px" }}>{Story()}</div>],

    argTypes: {
        onClick: {
            type: { name: "function", required: true },
            defaultValue: null,
            description: "This callback is called when the button is clicked",
            control: {
                disable: true,
            },
            table: {
                type: { summary: "data" },
                defaultValue: { summary: null },
            },
        },
        disabled: {
            type: { name: "boolean" },
            defaultValue: false,
            description: "Whether the control is disabled",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: false },
            },
        },
        timeout: {
            type: { name: "number" },
            description: "Duration to wait (in seconds) before reverting to previous state",
            defaultValue: 10000,
            table: {
                type: { summary: "number" },
                defaultValue: { summary: null },
            },
        },
        variant: {
            options: ["contained", "outlined", "text"],
            description: "The MUI variant of the button",
            defaultValue: "contained",
            control: { type: "select" },
        },
    },
};

export const MyApiSaveButton = (args) => <BugApiSaveButton {...args}>Click Me!</BugApiSaveButton>;
MyApiSaveButton.displayName = "BugApiSaveButton";
MyApiSaveButton.storyName = "BugApiSaveButton";
