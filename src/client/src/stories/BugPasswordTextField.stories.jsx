import BugPasswordTextField from "@core/BugPasswordTextField";

export default {
    title: "BUG Core/Controls/BugPasswordTextField",
    component: BugPasswordTextField,
    parameters: {
        docs: {
            description: {
                component: `A password textfield control with BUG styling.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    decorators: [(Story) => <div style={{ margin: "1em", maxWidth: "600px" }}>{Story()}</div>],

    argTypes: {
        type: {
            table: { disable: true },
        },
        value: {
            type: { name: "string", required: true },
            defaultValue: "12345",
            description: "The value to be displayed in the control",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: null },
            },
        },
        label: {
            type: { name: "string", required: true },
            defaultValue: "My Control Name",
            description: "Short description to be shown in the control",
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
        disabled: {
            type: { name: "boolean" },
            defaultValue: false,
            description: "Whether to disable the control",
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
        variant: {
            options: ["filled", "outlined", "standard"],
            description: "The MUI variant of the button",
            defaultValue: "standard",
            control: { type: "select" },
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "standard" },
            },
        },
        error: {
            type: { name: "boolean", required: false },
            defaultValue: false,
            description:
                "This is usually handled by the parent BugForm but can also be set manually. Change the helperText to add additional error information.",
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
        allowShowPassword: {
            type: { name: "boolean", required: false },
            defaultValue: true,
            description:
                "Allows viewing of the password using the icon button. This is only available when the control is not disabled.",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: true },
            },
        },
    },
};

export const MyBugPasswordTextField = (args) => {
    return <BugPasswordTextField {...args} onChange={() => {}} />;
};

MyBugPasswordTextField.displayName = "BugPasswordTextField";
MyBugPasswordTextField.storyName = "BugPasswordTextField";
