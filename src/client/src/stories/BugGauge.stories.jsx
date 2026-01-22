import BugGauge from "@core/BugGauge";
import { Controls, Description, Story, Subtitle, Title } from "@storybook/blocks";

export default {
    title: "BUG Core/Controls/BugGauge",
    component: BugGauge,
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
                component: `A gauge control which can be used in a BUG module to display temperature, disk space, etc.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    args: {
        title: "Bug Gauge",
        value: 50,
        max: 100,
        unit: "%",
        decimalPlaces: 2,
        sx: {},
    },

    argTypes: {
        value: {
            description: "Current value of the gauge",
            control: { type: "number" },
            table: {
                type: { summary: "number" },
                defaultValue: { summary: 0 },
            },
        },
        max: {
            description: "Maximum value of the gauge",
            control: { type: "number" },
            table: {
                type: { summary: "number" },
                defaultValue: { summary: 100 },
            },
        },
        decimalPlaces: {
            description: "The number of decimal places to be displayed",
            control: { type: "number" },
            table: {
                type: { summary: "number" },
                defaultValue: { summary: 2 },
            },
        },
        unit: {
            description: "The unit string to be displayed after the value, e.g., %",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "%" },
            },
        },
        title: {
            description: "Title to be displayed at the top of the control",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "" },
            },
        },
        sx: {
            description: "MUI style overrides (the sx prop)",
            table: {
                type: { summary: "object" },
                defaultValue: { summary: "{}" },
            },
        },
    },
};

export const Default = {
    render: (args) => (
        <div style={{ padding: "20px", maxWidth: "400px" }}>
            <BugGauge {...args} />
        </div>
    ),
};
