import BugStatusBlock from "@core/BugStatusBlock";

export default {
    title: "BUG Core/Controls/BugStatusBlock",
    component: BugStatusBlock,
    parameters: {
        docs: {
            description: {
                component: `A square block which indicates a status or configuration item on a device.<br />
                These should be contained by a BugStatusBlockContainer.<br />
                Text is automatically sized to fit the block.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    decorators: [(Story) => <div style={{ margin: "1em", maxWidth: "300px" }}>{Story()}</div>],

    argTypes: {
        items: {
            type: { name: "data", required: true },
            defaultValue: ["100", "Mbps"],
            description: "An array of strings to display inside the block",
            table: {
                type: { summary: "data" },
                defaultValue: { summary: "[]" },
            },
        },
        label: {
            type: { name: "string", required: true },
            defaultValue: "Bitrate",
            description: "Text to show at the top of the block",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: null },
            },
        },
        state: {
            type: { name: "string", required: false },
            defaultValue: "success",
            description: "",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "10rem" },
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

export const MyBugStatusBlock = (args) => <BugStatusBlock {...args} />;

MyBugStatusBlock.displayName = "BugStatusBlock";
MyBugStatusBlock.storyName = "BugStatusBlock";
