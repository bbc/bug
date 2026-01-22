import BugTimePicker from "@core/BugTimePicker";
import { Controls, Description, Story, Subtitle, Title } from "@storybook/blocks";
import { useEffect, useState } from "react";

export default {
    title: "BUG Core/Controls/BugTimePicker",
    component: BugTimePicker,
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
                component: `A specialized time input control with BUG styling. It provides a clean interface for selecting hours and minutes, integrating seamlessly with standard Javascript Date objects.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    args: {
        value: new Date("2026-01-22T21:11:54"),
        variant: "filled",
        sx: {},
    },

    argTypes: {
        value: {
            description: "The selected time. This must be a valid Javascript Date object.",
            table: {
                type: { summary: "Date" },
                defaultValue: { summary: "null" },
            },
        },
        variant: {
            options: ["filled", "outlined", "standard"],
            control: { type: "select" },
            description: "The MUI variant of the underlying text field.",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "filled" },
            },
        },
        onChange: {
            description: "Callback fired when the time is changed. Returns the new Date object.",
            control: { disable: true },
            table: { type: { summary: "function" } },
        },
        sx: {
            description: "MUI style overrides (the sx prop).",
            table: {
                type: { summary: "object" },
                defaultValue: { summary: "{}" },
            },
        },
    },
};

export const Default = {
    render: (args) => {
        const [selectedTime, setSelectedTime] = useState(args.value);

        // Sync local state if changed via Storybook Controls
        useEffect(() => {
            setSelectedTime(args.value);
        }, [args.value]);

        return (
            <div style={{ padding: "20px", maxWidth: "300px" }}>
                <BugTimePicker {...args} value={selectedTime} onChange={(newValue) => setSelectedTime(newValue)} />
            </div>
        );
    },
};
