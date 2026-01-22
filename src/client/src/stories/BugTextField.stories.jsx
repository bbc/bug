import BugTextField from "@core/BugTextField";
import { Controls, Description, Story, Subtitle, Title } from "@storybook/blocks";
import { useEffect, useState } from "react";

export default {
    title: "BUG Core/Controls/BugTextField",
    component: BugTextField,
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
                component: `A standard text input control with BUG styling. It includes advanced features like input filtering, numeric enforcement (min/max), and optional deferred updates (changeOnBlur).`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    args: {
        value: "This is a textfield",
        label: "My Text Field",
        helperText: "Tell me something interesting",
        variant: "outlined",
        fullWidth: true,
        disabled: false,
        numeric: false,
        changeOnBlur: false,
        type: "text",
        sx: {},
    },

    argTypes: {
        value: {
            description: "The value to be displayed in the control.",
            table: { type: { summary: "string" } },
        },
        numeric: {
            description: "Enables support for min/max rules and enforces numerical values on blur.",
            table: { type: { summary: "boolean" }, defaultValue: { summary: false } },
        },
        filter: {
            description: "A regex string or callback function to sanitize input characters.",
            table: { type: { summary: "string | function" } },
        },
        changeOnBlur: {
            description: "If true, the onChange event only fires when the control loses focus.",
            table: { type: { summary: "boolean" }, defaultValue: { summary: false } },
        },
        min: {
            description: "Minimum value (requires 'numeric' to be enabled).",
            table: { type: { summary: "number" } },
        },
        max: {
            description: "Maximum value (requires 'numeric' to be enabled).",
            table: { type: { summary: "number" } },
        },
        maxLength: {
            description: "Specifies the maximum number of characters allowed.",
            table: { type: { summary: "number" } },
        },
        variant: {
            options: ["filled", "outlined", "standard"],
            control: { type: "select" },
            description: "The MUI variant of the control.",
            table: { type: { summary: "string" }, defaultValue: { summary: "outlined" } },
        },
        onChange: {
            description: "Callback called when the value changes.",
            control: { disable: true },
            table: { type: { summary: "function" } },
        },
        sx: {
            description: "MUI style overrides (the sx prop).",
            table: { type: { summary: "object" } },
        },
    },
};

export const Default = {
    render: (args) => {
        const [value, setValue] = useState(args.value);

        useEffect(() => {
            setValue(args.value);
        }, [args.value]);

        return (
            <div style={{ padding: "20px", maxWidth: "600px" }}>
                <BugTextField {...args} value={value} onChange={(e) => setValue(e.target.value)} />
            </div>
        );
    },
};

export const NumericOnly = {
    args: {
        label: "Age Input",
        value: "25",
        numeric: true,
        min: 0,
        max: 120,
        helperText: "Enforces numbers between 0 and 120",
    },
    render: (args) => {
        const [value, setValue] = useState(args.value);
        return (
            <div style={{ padding: "20px", maxWidth: "600px" }}>
                <BugTextField {...args} value={value} onChange={(e) => setValue(e.target.value)} />
            </div>
        );
    },
};
