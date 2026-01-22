import BugApiSelect from "@core/BugApiSelect";
import { Controls, Description, Story, Subtitle, Title } from "@storybook/blocks";

export default {
    title: "BUG Core/API Controls/BugApiSelect",
    component: BugApiSelect,
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
                component: `A dropdown which is designed for use with an API.<br />
                Triggers the onChange event, and disables the control to allow the new value to be updated.<br />
                If the value hasn't changed within the timeout period the control is re-enabled.<br />
                Takes an options array - which should contain objects with id and label properties.`,
            },
        },

        controls: { sort: "requiredFirst" },
    },
    args: {
        disabled: false,
        fullWidth: true,
        timeout: 5000,
        value: "zebra",
        variant: "standard",
        sx: {},
        options: [
            { id: "zebra", label: "Zebra" },
            { id: "caterpillar", label: "Caterpillar" },
            { id: "horse", label: "Horse" },
        ],
    },
    argTypes: {
        onChange: {
            action: "changed", // Uses the Actions panel automatically
            description: "This callback is called when the selection is changed.",
            table: { type: { summary: "function" } },
        },
        options: {
            description: "An object array of available values. Each item must have an id and a label property.",
            table: {
                type: { summary: "object[]" },
            },
        },
        disabled: {
            description: "Whether the control is disabled",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: "false" },
            },
        },
        fullWidth: {
            description: "Expands the control to fill available horizontal space",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: "true" },
            },
        },
        renderItem: {
            description: "An optional callback function to render each item.",
            control: { disable: true },
            table: {
                type: { summary: "function" },
            },
        },
        sx: {
            description: "MUI sx prop for style overrides.",
            table: {
                type: { summary: "object" },
                defaultValue: { summary: "{}" },
            },
        },
        value: {
            description: "The selected value when the control is loaded.",
            table: {
                type: { summary: "string | number" },
            },
        },
        variant: {
            options: ["filled", "outlined", "standard"],
            description: "The MUI variant of the control.",
            control: { type: "select" },
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "standard" },
            },
        },
        timeout: {
            description: "Duration to wait (ms) before reverting state",
            table: {
                type: { summary: "number" },
                defaultValue: { summary: "5000" },
            },
        },
    },
};

export const Default = {
    render: (args) => (
        <div style={{ padding: "20px", maxWidth: "600px" }}>
            <BugApiSelect
                {...args}
                onChange={(e) => {
                    console.log("Selected:", e.target.value);
                }}
            />
        </div>
    ),
};
