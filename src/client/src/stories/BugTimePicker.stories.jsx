import React from "react";
import BugTimePicker from "@core/BugTimePicker";

export default {
    title: "BUG Core/Controls/BugTimePicker",
    component: BugTimePicker,
    parameters: {
        docs: {
            description: {
                component: `A time picker control with BUG styling.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    decorators: [(Story) => <div style={{ margin: "1em", maxWidth: "600px" }}>{Story()}</div>],

    argTypes: {
        onChange: {
            type: { name: "function", required: true },
            defaultValue: {},
            description: "This callback is called when the value changes",
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
            defaultValue: null,
            description: "The selected value when the control is loaded (valid Javascript Date object)",
            table: {
                type: { summary: "data" },
                defaultValue: { summary: null },
            },
        },
        variant: {
            options: ["filled", "outlined", "standard"],
            description: "The MUI variant of the control",
            defaultValue: "filled",
            control: { type: "select" },
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "filled" },
            },
        },
    },
};

export const MyBugTimePicker = (args) => {
    const [value, setValue] = React.useState(new Date("2014-08-18T21:11:54"));
    return (
        <BugTimePicker
            {...args}
            value={value}
            onChange={(newValue) => {
                setValue(newValue);
            }}
        />
    );
};

MyBugTimePicker.displayName = "BugTimePicker";
MyBugTimePicker.storyName = "BugTimePicker";
