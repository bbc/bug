import BugStatusBlockContainer from "@core/BugStatusBlockContainer";
import { Controls, Description, Story, Subtitle, Title } from "@storybook/blocks";

export default {
    title: "BUG Core/Controls/BugStatusBlockContainer",
    component: BugStatusBlockContainer,
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
                component: `A horizontal panel that wraps multiple **BugStatusBlocks**. It is commonly used in device dashboards to provide a high-level overview of configuration and operational health.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    args: {
        items: [
            { label: "Input", state: "error", items: ["No Signal"] },
            { label: "Bitrate", state: "success", items: ["100", "Mbps"] },
            { label: "Sync", state: "warning", items: ["Drifting"] },
            { label: "Output", state: "success", items: ["Enabled"] },
        ],
        sx: {},
    },

    argTypes: {
        items: {
            description:
                "An array of objects representing individual status blocks. Each object follows the **BugStatusBlock** schema.",
            table: {
                type: { summary: "array" },
                defaultValue: { summary: "[]" },
            },
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
    render: (args) => (
        <div style={{ padding: "20px", width: "100%", maxWidth: "900px" }}>
            <BugStatusBlockContainer {...args} />
        </div>
    ),
};
