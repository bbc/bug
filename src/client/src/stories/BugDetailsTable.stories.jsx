import BugDetailsTable from "@core/BugDetailsTable";
import { Controls, Description, Story, Subtitle, Title } from "@storybook/blocks";

export default {
    title: "BUG Core/Layout/BugDetailsTable",
    component: BugDetailsTable,
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
                component: `A simple table for displaying name/value-style content. <br />
                This is the underlying component used by **BugDetailsCard**.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    args: {
        gridLines: true,
        width: "10rem",
        items: [
            { name: "Voltage 1", value: "12.3 V" },
            { name: "Voltage 2", value: "12.3 V" },
        ],
        sx: {},
    },

    argTypes: {
        items: {
            description: "An array of objects with name and value properties to display.",
            table: {
                type: { summary: "array" },
                defaultValue: { summary: "[]" },
            },
        },
        gridLines: {
            description: "Whether to show grid lines between each row.",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: "true" },
            },
        },
        width: {
            description: "The width of the table - can be any valid CSS unit.",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "10rem" },
            },
        },
        sx: {
            description: "MUI style overrides.",
            table: {
                type: { summary: "object" },
                defaultValue: { summary: "{}" },
            },
        },
    },
};

export const Default = {
    render: (args) => (
        <div style={{ padding: "20px" }}>
            <div style={{ backgroundColor: "#262626", maxWidth: "600px" }}>
                <BugDetailsTable {...args} />
            </div>
        </div>
    ),
};
