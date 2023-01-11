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
        activeColor: {
            control: "color",
            defaultValue: "primary.main",
            description: "The icon colour when enabled - see MaterialUI for options",
            table: {
                type: { summary: "color" },
                defaultValue: { summary: "primary.main" },
            },
        },
        disabled: {
            type: { name: "boolean" },
            defaultValue: false,
            description: "Whether the control is disabled",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: false },
            },
        },
        sx: {
            type: { name: "data" },
            defaultValue: {},
            description:
                "An object containing style overrides - see MaterialUI docs for options: https://mui.com/system/getting-started/the-sx-prop/",
            table: {
                type: { summary: "data" },
                defaultValue: { summary: "{}" },
            },
        },
    },
};

export const MyBugPowerIcon = (args) => <BugPowerIcon {...args} />;

MyBugPowerIcon.displayName = "BugPowerIcon";
MyBugPowerIcon.storyName = "BugPowerIcon";
