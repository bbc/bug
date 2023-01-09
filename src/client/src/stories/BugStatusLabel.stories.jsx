import BugStatusLabel from "@core/BugStatusLabel";

export default {
    title: "BUG Core/Controls/BugStatusLabel",
    component: BugStatusLabel,
    parameters: {
        docs: {
            description: {
                component: `A simple label to show the status of an item. Can be used in a table or other containers.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    decorators: [(Story) => <div style={{ margin: "1em", maxWidth: "300px" }}>{Story()}</div>],

    argTypes: {
        children: {
            type: { name: "string", required: true },
            defaultValue: "Item is running",
            description: "Text to display inside the label",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "" },
            },
        },
        color: {
            options: ["primary.main", "secondary.main", "error.main", "success.main"],
            defaultValue: "success.main",
            description: "The color to use for the text in the control - see MaterialUI for options",
            control: { type: "select" },
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "primary.main" },
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

export const MyBugStatusLabel = (args) => <BugStatusLabel {...args} />;

MyBugStatusLabel.displayName = "BugStatusLabel";
MyBugStatusLabel.storyName = "BugStatusLabel";
