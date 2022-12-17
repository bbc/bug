import BugPanelGroupDropdown from "@core/BugPanelGroupDropdown";

export default {
    title: "BUG Core/Controls/BugPanelGroupDropdown",
    component: BugPanelGroupDropdown,
    parameters: {
        docs: {
            description: {
                component: `A dropdown control listing all available panel groups. Can also be used to add a new group.<br />
**Please Note**: the control will not be populated with data on this storybook`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    decorators: [(Story) => <div style={{ margin: "1em", maxWidth: "600px" }}>{Story()}</div>],

    argTypes: {
        variant: { table: { disable: true } },
        onChange: {
            type: { name: "function", required: true },
            defaultValue: {},
            description: "This callback is called when the dropdown value changes",
            control: {
                disable: true,
            },
            table: {
                type: { summary: "data" },
                defaultValue: { summary: null },
            },
        },
        fullWidth: {
            type: { name: "boolean" },
            defaultValue: false,
            description: "Expands the control to fill available horizontal space",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: false },
            },
        },
        value: {
            type: { name: "string", required: false },
            defaultValue: "Group 1",
            description: "The selected value when the control is loaded.",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: null },
            },
        },
    },
};

export const MyBugPanelGroupDropdown = (args) => <BugPanelGroupDropdown {...args} />;

MyBugPanelGroupDropdown.displayName = "BugPanelGroupDropdown";
MyBugPanelGroupDropdown.storyName = "BugPanelGroupDropdown";
