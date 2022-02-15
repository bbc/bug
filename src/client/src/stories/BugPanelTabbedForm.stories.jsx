import BugPanelTabbedForm from "@core/BugPanelTabbedForm";
import Box from "@mui/material/Box";

export default {
    title: "BUG Core/Wrappers/BugPanelTabbedForm",
    component: BugPanelTabbedForm,
    parameters: {
        docs: {
            description: {
                component: `Tabs are ideal for switching between multiple views in a panel.<br />
                This component also provides url re-routing and overwriting, allowing users to navigate directly to each tab.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    decorators: [(Story) => <div style={{ margin: "1em" }}>{Story()}</div>],

    argTypes: {
        contentProps: {
            type: { name: "data", required: false },
            defaultValue: {},
            description: "An object containing props to pass to the MUI Paper component which wraps the content",
            table: {
                type: { summary: "data" },
                defaultValue: { summary: "{}" },
            },
        },
        onClose: {
            type: { name: "function", required: true },
            defaultValue: null,
            description:
                "This callback is called when the close button is pressed. If it is not defined then the close button will not be displayed.",
            control: {
                disable: true,
            },
            table: {
                type: { summary: "data" },
                defaultValue: { summary: null },
            },
        },
        labels: {
            type: { name: "data", required: true },
            defaultValue: ["Details", "Statistics", "Hardware"],
            description: "An array of tab labels to display",
            table: {
                type: { summary: "data" },
                defaultValue: { summary: "[]" },
            },
        },
        locations: {
            type: { name: "data", required: true },
            defaultValue: [
                "/panel/${panelId}/interface/${interfaceId}/details",
                "/panel/${panelId}/interface/${interfaceId}/statistics",
                "/panel/${panelId}/interface/${interfaceId}/hardware",
            ],
            description:
                "An array of URLs to match to each tab. Make sure you embed the panelId in the URL and create a valid route in the ModuleWrapper",
            table: {
                type: { summary: "data" },
                defaultValue: { summary: "[]" },
            },
        },
        content: {
            type: { name: "data", required: true },
            defaultValue: [
                <Box sx={{ margin: 4 }}>This is the details tab</Box>,
                <Box sx={{ margin: 4 }}>This is the statistics tab</Box>,
                <Box sx={{ margin: 4 }}>This is the hardware tab</Box>,
            ],
            description: "An array of React components which contain the content for each tab",
            control: {
                disable: true,
            },
            table: {
                type: { summary: "data" },
                defaultValue: { summary: "[]" },
            },
        },
        defaultTab: {
            type: { name: "number", required: false },
            defaultValue: 0,
            description: "The tab to load when the component is mounted.",
            table: {
                type: { summary: "number" },
                defaultValue: { summary: 0 },
            },
        },
    },
};

export const MyBugPanelTabbedForm = (args) => <BugPanelTabbedForm {...args} />;

MyBugPanelTabbedForm.displayName = "BugPanelTabbedForm";
MyBugPanelTabbedForm.storyName = "BugPanelTabbedForm";
