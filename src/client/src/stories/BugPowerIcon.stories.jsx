import BugPowerIcon from "@core/BugPowerIcon";

export default {
    title: "BUG Core/Icons/BugPowerIcon",
    component: BugPowerIcon,
    parameters: {
        docs: {
            description: {
                component: `A handy power state icon to use in tables to indicate that the item is online.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    decorators: [(Story) => <div style={{ margin: "1em", maxWidth: "6rem" }}>{Story()}</div>],

    argTypes: {
        disabled: {
            type: { name: "boolean" },
            defaultValue: false,
            description: "Whether the control is disabled",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: false },
            },
        },
    },
};

export const MyBugPowerIcon = (args) => <BugPowerIcon {...args} />;

MyBugPowerIcon.displayName = "BugPowerIcon";
MyBugPowerIcon.storyName = "BugPowerIcon";
