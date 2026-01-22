import BugTimeZonePicker from "@core/BugTimeZonePicker";
import { Controls, Description, Story, Subtitle, Title } from "@storybook/blocks";
import { useEffect, useState } from "react";

export default {
    title: "BUG Core/Controls/BugTimeZonePicker",
    component: BugTimeZonePicker,
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
                component: `A specialized autocomplete dropdown pre-populated with a comprehensive list of global timezones, including UTC offsets.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    args: {
        label: "System Timezone",
        value: "(UTC+00:00) Dublin, Edinburgh, Lisbon, London",
        helperText: "Select the local timezone for this device",
        variant: "outlined",
        sx: {},
    },

    argTypes: {
        label: {
            description: "Short description shown as the label of the control.",
            table: { type: { summary: "string" } },
        },
        value: {
            description: "The currently selected timezone string.",
            table: { type: { summary: "string" } },
        },
        helperText: {
            description: "Optional instruction text shown below the dropdown.",
            table: { type: { summary: "string" } },
        },
        variant: {
            options: ["filled", "outlined", "standard"],
            control: { type: "select" },
            description: "The MUI variant of the underlying text field.",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "outlined" },
            },
        },
        onChange: {
            description: "Callback fired when the selection changes. Returns the event and the timezone object.",
            control: { disable: true },
            table: { type: { summary: "function" } },
        },
        sx: {
            description: "MUI style overrides.",
            table: { type: { summary: "object" } },
        },
    },
};

export const Default = {
    render: (args) => {
        const [selected, setSelected] = useState(args.value);

        // Update local state if the Control panel value changes
        useEffect(() => {
            setSelected(args.value);
        }, [args.value]);

        return (
            <div style={{ padding: "20px", maxWidth: "600px" }}>
                <BugTimeZonePicker
                    {...args}
                    value={selected}
                    onChange={(event, timezone) => {
                        // Assuming timezone is an object with a label property
                        setSelected(timezone?.label || "");
                    }}
                />
            </div>
        );
    },
};
