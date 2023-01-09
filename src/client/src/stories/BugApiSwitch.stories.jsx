import BugApiSwitch from "@core/BugApiSwitch";

export default {
    title: "BUG Core/API Controls/BugApiSwitch",
    component: BugApiSwitch,
    parameters: {
        docs: {
            description: {
                component: `A switch control which is designed for use with an API.<br />
                Triggers the onChange event, and disables the control to allow the new value to be updated.<br />
                If the value hasn't changed within the timeout period the control is re-enabled and the previous state loaded.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    decorators: [(Story) => <div style={{ margin: "1em", maxWidth: "300px" }}>{Story()}</div>],

    argTypes: {
        onChange: { action: "changed", table: { disable: true } },
        checked: {
            type: { name: "boolean" },
            defaultValue: false,
            description: "Whether the control is checked ",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: false },
            },
        },
        color: {
            options: ["primary", "secondary", "default"],
            defaultValue: "primary",
            description: "The color to pass to the Switch control - see MaterialUI for options",
            control: { type: "select" },
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "primary" },
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
        timeout: {
            type: { name: "number" },
            description: "Duration to wait (in seconds) before reverting to previous state",
            defaultValue: 10000,
            table: {
                type: { summary: "number" },
                defaultValue: { summary: null },
            },
        },
    },
};

export const MyApiSwitch = (args) => <BugApiSwitch {...args}>Click Me!</BugApiSwitch>;
MyApiSwitch.displayName = "BugApiSwitch";
MyApiSwitch.storyName = "BugApiSwitch";
