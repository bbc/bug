import BugStatusLabel from "@core/BugStatusLabel";
import { Controls, Description, Story, Subtitle, Title } from "@storybook/blocks";

export default {
    title: "BUG Core/Controls/BugStatusLabel",
    component: BugStatusLabel,
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
                component: `A simple, stylized label used to represent the status of an item. It is frequently used within table cells or list items for quick visual reference.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    args: {
        children: "Item is running",
        sx: {},
    },

    argTypes: {
        children: {
            name: "label",
            type: { name: "string", required: true },
            description: "The text content to be displayed inside the label.",
            table: {
                type: { summary: "string" },
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
        <div style={{ padding: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
            <BugStatusLabel {...args} />
        </div>
    ),
};

export const InTableContext = {
    render: (args) => (
        <div style={{ padding: "20px", maxWidth: "400px", border: "1px solid #444", borderRadius: "4px" }}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px",
                    borderBottom: "1px solid #333",
                }}
            >
                <span>Main Processor</span>
                <BugStatusLabel {...args} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px" }}>
                <span>Backup Link</span>
                <BugStatusLabel sx={{ color: "warning.main" }}>Standby</BugStatusLabel>
            </div>
        </div>
    ),
};
