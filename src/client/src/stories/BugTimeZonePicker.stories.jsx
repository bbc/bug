import React from "react";
import BugTimeZonePicker from "@core/BugTimeZonePicker";

export default {
    title: "BUG Core/Controls/BugTimeZonePicker",
    component: BugTimeZonePicker,
    parameters: {
        docs: {
            description: {
                component: `A timezone dropdown with a populated list of available timezones.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    decorators: [(Story) => <div style={{ margin: "1em", maxWidth: "600px" }}>{Story()}</div>],

    argTypes: {
        helperText: {
            type: { name: "string", required: false },
            defaultValue: "Tell me something interesting",
            description: "Optional helper text to be shown below the control",
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
        onChange: {
            type: { name: "function", required: true },
            defaultValue: {},
            description: "This callback is called when the selection changes",
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
            defaultValue: "(UTC) Edinburgh, London",
            description: "The selected timezone when the control is loaded",
            table: {
                type: { summary: "data" },
                defaultValue: { summary: null },
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
    },
};

export const MyBugTimeZonePicker = (args) => {
    const [result, setResult] = React.useState(null);

    return (
        <BugTimeZonePicker
            {...args}
            value={result?.label}
            onChange={(event, timezone) => {
                setResult(timezone);
            }}
        />
    );
};

MyBugTimeZonePicker.displayName = "BugTimeZonePicker";
MyBugTimeZonePicker.storyName = "BugTimeZonePicker";
