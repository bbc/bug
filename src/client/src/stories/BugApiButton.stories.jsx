import BugApiButton from "@core/BugApiButton";

export default {
    title: "BUG Core/API Controls/BugApiButton",
    component: BugApiButton,
    parameters: {
        docs: {
            description: {
                component: `A simple button which is designed for use with an API.<br />
                Triggers the onClick event, and disables the control to allow the new value to be updated.<br />
                If the value hasn't changed within the timeout period the control is re-enabled.`,
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
        icon: {
            type: { name: "data", required: false },
            defaultValue: null,
            description: "Optional icon to display at the start of the button. Pass a valid React element.",
            control: {
                disable: true,
            },
            table: {
                type: { summary: "data" },
                defaultValue: { summary: null },
            },
        },
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
            description: "Duration to wait (in milliseconds) before reverting to previous state",
            defaultValue: 5000,
            table: {
                type: { summary: "number" },
                defaultValue: { summary: 5000 },
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

export const MyApiButton = (args) => (
    <BugApiButton
        {...args}
        onClick={() => {
            alert("thank you!");
        }}
    >
        Click Me!
    </BugApiButton>
);
MyApiButton.displayName = "BugApiButton";
MyApiButton.storyName = "BugApiButton";
