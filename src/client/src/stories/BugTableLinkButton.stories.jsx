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
        color: {
            options: ["primary", "secondary"],
            description: "The color type to display (primary, secondary)",
            defaultValue: "primary",
            control: { type: "select" },
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "primary" },
            },
        },
    },
};

export const MyBugTableLinkButton = (args) => <BugTableLinkButton {...args}>Some text to display</BugTableLinkButton>;

MyBugTableLinkButton.displayName = "BugTableLinkButton";
MyBugTableLinkButton.storyName = "BugTableLinkButton";