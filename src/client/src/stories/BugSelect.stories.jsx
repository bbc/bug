import BugSelect from "@core/BugSelect";
import { Controls, Description, Story, Subtitle, Title } from "@storybook/blocks";
import { useEffect, useState } from "react";

export default {
    title: "BUG Core/Controls/BugSelect",
    component: BugSelect,
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
                component: `A simple select dropdown with BUG styling. Options are passed as an array of objects, each requiring an <b>id</b> and <b>label</b>.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    args: {
        value: "zebra",
        options: [
            { id: "zebra", label: "Zebra" },
            { id: "caterpillar", label: "Caterpillar" },
            { id: "horse", label: "Horse" },
        ],
        variant: "outlined",
        fullWidth: true,
        disabled: false,
        sx: {},
    },

    argTypes: {
        options: {
            description: "An array of objects. Each item must have an **id** and a **label** property.",
            table: {
                type: { summary: "array" },
                defaultValue: { summary: "[]" },
            },
        },
        value: {
            description: "The selected value ID. Should match an ID in the options array.",
            table: {
                type: { summary: "string | number" },
            },
        },
        variant: {
            options: ["filled", "outlined", "standard"],
            control: { type: "select" },
            description: "The MUI variant of the control.",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "outlined" },
            },
        },
        onChange: {
            description: "Callback fired when the selection changes.",
            control: { disable: true },
            table: { type: { summary: "function" } },
        },
        renderItem: {
            description: "Optional function to customize item rendering: **(item) => ReactNode**.",
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
        const [val, setVal] = useState(args.value);

        // Keep state in sync if changed via Controls table
        useEffect(() => {
            setVal(args.value);
        }, [args.value]);

        return (
            <div style={{ padding: "20px", maxWidth: "600px" }}>
                <BugSelect {...args} value={val} onChange={(e) => setVal(e.target.value)} />
            </div>
        );
    },
};
