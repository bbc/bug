import BugPanelGroupDropdown from "@core/BugPanelGroupDropdown";
import { Controls, Description, Story, Subtitle, Title } from "@storybook/blocks";

export default {
    title: "BUG Core/Controls/BugPanelGroupDropdown",
    component: BugPanelGroupDropdown,
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
                component: `A dropdown control listing all available panel groups. Can also be used to add a new group.<br />
                **Please Note**: The control relies on application state/API and will not be populated with live data in this Storybook environment.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    args: {
        value: "Group 1",
        fullWidth: false,
        sx: {},
    },

    argTypes: {
        value: {
            description: "The selected value when the control is loaded.",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "null" },
            },
        },
        fullWidth: {
            description: "Expands the control to fill available horizontal space.",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: false },
            },
        },
        onChange: {
            description: "Callback fired when the dropdown value changes.",
            control: { disable: true },
            table: {
                type: { summary: "function" },
                defaultValue: { summary: "null" },
            },
        },
        sx: {
            description: "MUI style overrides (the sx prop).",
            table: {
                type: { summary: "object" },
                defaultValue: { summary: "{}" },
            },
        },
        variant: { table: { disable: true } },
    },
};

export const Default = {
    render: (args) => (
        <div style={{ padding: "20px", maxWidth: "600px" }}>
            <BugPanelGroupDropdown {...args} />
        </div>
    ),
};
