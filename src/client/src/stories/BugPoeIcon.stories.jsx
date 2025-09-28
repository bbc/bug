import BugPoeIcon from "@core/BugPoeIcon";

export default {
    title: "BUG Core/Icons/BugPoeIcon",
    component: BugPoeIcon,
    parameters: {
        docs: {
            description: {
                component: `A handy power icon to use in tables to indicate that the item has POE power.`,
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
        active: {
            type: { name: "boolean" },
            defaultValue: false,
            description: "Whether the control is active",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: false },
            },
        },
        error: {
            type: { name: "boolean" },
            defaultValue: false,
            description: "Whether the control is in an error state",
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

export const MyBugPowerIcon = (args) => <BugPoeIcon {...args} />;

MyBugPowerIcon.displayName = "BugPoeIcon";
MyBugPowerIcon.storyName = "BugPoeIcon";
