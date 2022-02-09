import BugDynamicIcon from "@core/BugDynamicIcon";

export default {
    title: "BUG Core/Icons/BugDynamicIcon",
    component: BugDynamicIcon,
    parameters: {
        docs: {
            description: {
                component: `A wrapper for both Material UI and Material Design icons.<br/>
https://mui.com/components/material-icons/<br />
https://materialdesignicons.com/ <br />
Pass in the iconName and BugDynamicIcon will render the correct icon.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    decorators: [(Story) => <div style={{ margin: "1em", maxWidth: "300px" }}>{Story()}</div>],

    argTypes: {
        iconName: {
            type: { name: "string", required: false },
            defaultValue: "mdi-bugle",
            description: "The icon name",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: null },
            },
        },
        color: {
            control: "color",
            description: "The selected color",
            defaultValue: "#ff3822",
            table: {
                type: { summary: "color" },
                defaultValue: { summary: null },
            },
        },
    },
};

export const MyBugDynamicIcon = (args) => <BugDynamicIcon {...args} />;

MyBugDynamicIcon.displayName = "BugDynamicIcon";
MyBugDynamicIcon.storyName = "BugDynamicIcon";
