import BugTextField from "@core/BugTextField";

export default {
    title: "BUG Core/Controls/BugTextField",
    component: BugTextField,
    parameters: {
        docs: {
            description: {
                component: `A password textfield control with BUG styling and optional filtering.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    decorators: [(Story) => <div style={{ margin: "1em", maxWidth: "600px" }}>{Story()}</div>],

    argTypes: {
        changeOnBlur: {
            type: { name: "boolean" },
            defaultValue: false,
            description: "Whether to wait until the control loses focus before emitting a changed event",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: false },
            },
        },
        disabled: {
            type: { name: "boolean" },
            defaultValue: false,
            description: "Whether to disable the control",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: false },
            },
        },
        filter: {
            type: { name: "string", required: false },
            defaultValue: null,
            description:
                "Can either be a callback function (which is passed a value) or a regular expression which removes the specified characters.",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: null },
            },
        },
        fullWidth: {
            type: { name: "boolean" },
            defaultValue: true,
            description: "Expands the control to fill available horizontal space",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: false },
            },
        },
        helperText: {
            type: { name: "string", required: false },
            defaultValue: "Tell me something interesting",
            description: "Optional helper text to be shown below the control",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: null },
            },
        },
        max: {
            type: { name: "number" },
            defaultValue: null,
            description: "Enforces a maximum value for the control (NOTE - only works if 'numeric' is enabled)",
            table: {
                type: { summary: "number" },
                defaultValue: { summary: null },
            },
        },
        maxLength: {
            type: { name: "number" },
            defaultValue: null,
            description: "Specifies the maximum number of characters allowed in the control",
            table: {
                type: { summary: "number" },
                defaultValue: { summary: null },
            },
        },
        min: {
            type: { name: "number" },
            defaultValue: null,
            description: "Enforces a minimum value for the control (NOTE - only works if 'numeric' is enabled)",
            table: {
                type: { summary: "number" },
                defaultValue: { summary: null },
            },
        },
        numeric: {
            type: { name: "boolean", required: false },
            defaultValue: false,
            description:
                "Enables support for min/max rules, and enforces only numerical values when control loses focus",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: false },
            },
        },
        onChange: {
            type: { name: "function", required: true },
            defaultValue: {},
            description: "This callback is called when the control changes",
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
        type: {
            type: { name: "string", required: false },
            defaultValue: "text",
            description: "HTML5 input type",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "text" },
            },
        },
        variant: {
            options: ["filled", "outlined", "standard"],
            description: "The MUI variant of the control",
            defaultValue: "outlined",
            control: { type: "select" },
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "outlined" },
            },
        },
        value: {
            type: { name: "string", required: true },
            defaultValue: "This is a textfield",
            description: "Value to be displayed in the control",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: null },
            },
        },
    },
};

export const MyBugTextField = (args) => {
    return <BugTextField {...args} onChange={() => {}} />;
};

MyBugTextField.displayName = "BugTextField";
MyBugTextField.storyName = "BugTextField";
