import BugTableLinkButton from "@core/BugTableLinkButton";
import { Controls, Description, Story, Subtitle, Title } from "@storybook/blocks";

export default {
    title: "BUG Core/Controls/BugTableLinkButton",
    component: BugTableLinkButton,
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
                component: `A specialized link button designed for high-density layouts like **BugApiTable**. It provides a clickable text interface with minimal padding to maintain table row heights.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    args: {
        children: "View Details",
        disabled: false,
        sx: {},
    },

    argTypes: {
        children: {
            name: "label",
            description: "The text or components to display inside the link.",
            table: {
                type: { summary: "ReactNode" },
            },
        },
        disabled: {
            description: "If true, the button is not clickable and follows the 'disabled' theme styling.",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: false },
            },
        },
        onClick: {
            description: "Callback fired when the link button is clicked.",
            control: { disable: true },
            table: {
                type: { summary: "function" },
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
        <div style={{ padding: "20px" }}>
            <BugTableLinkButton {...args} />
        </div>
    ),
};

export const InTableContext = {
    render: (args) => (
        <div style={{ padding: "20px", maxWidth: "500px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", color: "#eee" }}>
                <thead>
                    <tr style={{ textAlign: "left", borderBottom: "1px solid #444" }}>
                        <th style={{ padding: "8px" }}>Device Name</th>
                        <th style={{ padding: "8px" }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style={{ borderBottom: "1px solid #333" }}>
                        <td style={{ padding: "8px" }}>Encoder-01</td>
                        <td style={{ padding: "8px" }}>
                            <BugTableLinkButton {...args} />
                        </td>
                    </tr>
                    <tr>
                        <td style={{ padding: "8px" }}>Decoder-04</td>
                        <td style={{ padding: "8px" }}>
                            <BugTableLinkButton {...args}>Configure</BugTableLinkButton>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    ),
};
