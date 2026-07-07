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
                component: `A horizontal panel that wraps multiple **BugStatusBlocks** and groups. It is commonly used in device dashboards to provide a high-level overview of configuration and operational health. Items can be individual status blocks or arrays of status blocks (rendered with a faint border).`,
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
                "An array of status blocks or arrays of status blocks. Individual objects follow the **BugStatusBlock** schema. Arrays are rendered as groups with a subtle border.",
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
            <p style={{ marginBottom: "20px" }}>
                <strong>Individual blocks:</strong>
            </p>
            <BugStatusBlockContainer
                items={[
                    { label: "Input", state: "error", items: ["No Signal"] },
                    { label: "Bitrate", state: "success", items: ["100", "Mbps"] },
                    { label: "Sync", state: "warning", items: ["Drifting"] },
                    { label: "Output", state: "success", items: ["Enabled"] },
                ]}
            />

            <p style={{ marginTop: "40px", marginBottom: "20px" }}>
                <strong>Grouped blocks (with subtle border):</strong>
            </p>
            <BugStatusBlockContainer
                items={[
                    { label: "Input", state: "error", items: ["No Signal"] },
                    [
                        { label: "Left Channel", state: "success", items: ["100"] },
                        { label: "Right Channel", state: "success", items: ["100"] },
                    ],
                    { label: "Output", state: "success", items: ["Enabled"] },
                ]}
            />
        </div>
    ),
};

export const WithGroupedBlocks = {
    args: {
        items: [
            { label: "Input", state: "error", items: ["No Signal"] },
            [
                { label: "Left", state: "success", items: ["100"] },
                { label: "Right", state: "success", items: ["100"] },
            ],
            { label: "Output", state: "success", items: ["Enabled"] },
        ],
    },
    render: (args) => (
        <div style={{ padding: "20px", width: "100%", maxWidth: "900px" }}>
            <BugStatusBlockContainer {...args} />
        </div>
    ),
};
