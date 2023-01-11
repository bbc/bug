import BugTableLinkButton from "@core/BugTableLinkButton";

export default {
    title: "BUG Core/Controls/BugTableLinkButton",
    component: BugTableLinkButton,
    parameters: {
        docs: {
            description: {
                component: `A link button for use in BugApiTables.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    argTypes: {
        children: {
            control: {
                disable: true,
            },
            type: { name: "data", required: true },
            description: "The text (and optionally other components) to display inside the link control",
            table: {
                type: { summary: "data" },
                defaultValue: { summary: null },
            },
        },
        disabled: {
            type: { name: "boolean" },
            defaultValue: false,
            description: "Whether to disable the control",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: false },
            },
        },
        onClick: {
            type: { name: "function", required: true },
            defaultValue: null,
            description: "This callback is called when the button is clicked",
            control: {
                disable: true,
            },
            table: {
                type: { summary: "data" },
                defaultValue: { summary: null },
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

export const MyBugTableLinkButton = (args) => <BugTableLinkButton {...args}>Some text to display</BugTableLinkButton>;

MyBugTableLinkButton.displayName = "BugTableLinkButton";
MyBugTableLinkButton.storyName = "BugTableLinkButton";
