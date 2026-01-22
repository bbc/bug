import BugPasswordTextField from "@core/BugPasswordTextField";
import { Controls, Description, Story, Subtitle, Title } from "@storybook/blocks";
import React from "react";

export default {
    title: "BUG Core/Controls/BugPasswordTextField",
    component: BugPasswordTextField,
    parameters: {
        docs: {
            page: () => (
                <>
                    <Title />
                    <Subtitle />
                    <Description />
                    <Story />
                    <Controls />
                </>
            ),
            description: {
                component: `A password textfield control with BUG styling and a built-in visibility toggle.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    args: {
        label: "Password",
        value: "12345",
        helperText: "Enter your secret key",
        variant: "standard",
        fullWidth: true,
        disabled: false,
        allowShowPassword: true,
        sx: {},
    },

    argTypes: {
        label: {
            description: "Short description to be shown in the control",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "null" },
            },
        },
        value: {
            description: "The value to be displayed in the control",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "null" },
            },
        },
        variant: {
            options: ["filled", "outlined", "standard"],
            control: { type: "select" },
            description: "The MUI variant of the control",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "standard" },
            },
        },
        allowShowPassword: {
            description: "Allows viewing of the password using the icon button (only when not disabled).",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: true },
            },
        },
        helperText: {
            description: "Optional helper text to be shown below the control",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "null" },
            },
        },
        fullWidth: {
            description: "Expands the control to fill available horizontal space",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: false },
            },
        },
        disabled: {
            description: "Whether to disable the control",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: false },
            },
        },
        onChange: {
            description: "Callback called when the control value changes",
            control: { disable: true },
            table: { type: { summary: "function" } },
        },
        sx: {
            description: "MUI style overrides (the sx prop)",
            table: {
                type: { summary: "object" },
                defaultValue: { summary: "{}" },
            },
        },
        type: { table: { disable: true } },
    },
};

export const Default = {
    render: (args) => {
        const [value, setValue] = React.useState(args.value);

        React.useEffect(() => {
            setValue(args.value);
        }, [args.value]);

        return (
            <div style={{ padding: "20px", maxWidth: "600px" }}>
                <BugPasswordTextField {...args} value={value} onChange={(e) => setValue(e.target.value)} />
            </div>
        );
    },
};
