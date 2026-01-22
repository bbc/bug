import BugDynamicIcon from "@core/BugDynamicIcon";
import { Controls, Description, Story, Subtitle, Title } from "@storybook/blocks";

export default {
    title: "BUG Core/Icons/BugDynamicIcon",
    component: BugDynamicIcon,
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
                component: `A wrapper for both Material UI and Material Design icons.<br/>
                https://mui.com/components/material-icons/<br />
                https://materialdesignicons.com/ <br />
                Pass in the <b>iconName</b> and BugDynamicIcon will render the correct icon.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    args: {
        iconName: "MusicNote",
        color: "#ff3822",
    },

    argTypes: {
        iconName: {
            description: "The name of the icon (e.g., 'Settings').",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "MusicNote" },
            },
        },
        color: {
            control: "color",
            description: "The color of the icon.",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "#ff3822" },
            },
        },
    },
};

export const Default = {
    render: (args) => (
        <div style={{ padding: "20px", maxWidth: "200px" }}>
            <BugDynamicIcon {...args} />
        </div>
    ),
};
