import BugPanelTabbedForm from "@core/BugPanelTabbedForm";
import { Box } from "@mui/material";
import { Controls, Description, Story, Subtitle, Title } from "@storybook/blocks";

export default {
    title: "BUG Core/Wrappers/BugPanelTabbedForm",
    component: BugPanelTabbedForm,
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
                component: `Tabs are ideal for switching between multiple views in a panel.<br />
                This component also provides URL re-routing and overwriting, allowing users to navigate directly to each tab via the address bar.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    args: {
        labels: ["Details", "Statistics", "Hardware"],
        locations: ["/details", "/statistics", "/hardware"],
        content: [
            <Box key="details" sx={{ p: 4 }}>
                This is the details tab
            </Box>,
            <Box key="stats" sx={{ p: 4 }}>
                This is the statistics tab
            </Box>,
            <Box key="hw" sx={{ p: 4 }}>
                This is the hardware tab
            </Box>,
        ],
        defaultTab: 0,
        contentProps: {},
        sx: {},
    },

    argTypes: {
        labels: {
            description: "An array of tab labels to display.",
            table: {
                type: { summary: "string[]" },
                defaultValue: { summary: "[]" },
            },
        },
        locations: {
            description: "An array of URLs to match each tab. Ensure valid routes exist in the ModuleWrapper.",
            table: {
                type: { summary: "string[]" },
                defaultValue: { summary: "[]" },
            },
        },
        content: {
            control: { disable: true },
            description: "An array of React components containing the content for each tab.",
            table: {
                type: { summary: "ReactNode[]" },
                defaultValue: { summary: "[]" },
            },
        },
        defaultTab: {
            description: "The index of the tab to load when the component mounts.",
            table: {
                type: { summary: "number" },
                defaultValue: { summary: 0 },
            },
        },
        onClose: {
            description: "Callback fired when the close button is pressed. If undefined, the button is hidden.",
            control: { disable: true },
            table: { type: { summary: "function" } },
        },
        contentProps: {
            description: "Props passed to the MUI Paper component wrapping the content.",
            table: {
                type: { summary: "object" },
                defaultValue: { summary: "{}" },
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
        <div style={{ padding: "20px", maxWidth: "800px" }}>
            <BugPanelTabbedForm {...args} />
        </div>
    ),
};
