import BugStatusBlock from "@core/BugStatusBlock";
import { Controls, Description, Story, Subtitle, Title } from "@storybook/blocks";

export default {
    title: "BUG Core/Controls/BugStatusBlock",
    component: BugStatusBlock,
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
                component: `A square status indicator used for device metrics. It features automatic text scaling and status-driven background colors. Best used inside a <b>BugStatusBlockContainer</b>.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    args: {
        label: "Bitrate",
        items: ["100", "Mbps"],
        state: "success",
        image: "",
        sx: {},
    },

    argTypes: {
        label: {
            description: "Small header text displayed at the top of the block.",
            table: {
                type: { summary: "string" },
            },
        },
        items: {
            description: "An array of strings rendered in the center of the block. Font size scales automatically.",
            table: {
                type: { summary: "string[]" },
                defaultValue: { summary: "[]" },
            },
        },
        state: {
            control: "select",
            options: ["success", "warning", "error", "info", "disabled", "active"],
            description: "Determines the background color and theme of the block.",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "success" },
            },
        },
        image: {
            description: "If provided, displays an image instead of text labels.",
            table: {
                type: { summary: "string" },
            },
        },
        sx: {
            description: "MUI style overrides.",
            table: {
                type: { summary: "object" },
            },
        },
    },
};

export const Default = {
    render: (args) => (
        <div style={{ padding: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <BugStatusBlock {...args} />
        </div>
    ),
};
