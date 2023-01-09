import BugStatusBlockContainer from "@core/BugStatusBlockContainer";

export default {
    title: "BUG Core/Controls/BugStatusBlockContainer",
    component: BugStatusBlockContainer,
    parameters: {
        docs: {
            description: {
                component: `A horizontal panel containing BugStatusBlocks which indicate the running status of a device.<br />
                Often used for codecs to display configuration and operational status.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    argTypes: {
        items: {
            type: { name: "data", required: true },
            defaultValue: [
                { label: "Input", state: "error", items: ["No Signal"] },
                { label: "Bitrate", state: "success", items: ["100 Mbps"] },
                { label: "Output", state: "success", items: ["Enabled"] },
            ],
            description:
                "An array of objects containing label, state and items properties. See BugStatusBlock for example.",
            table: {
                type: { summary: "data" },
                defaultValue: { summary: "[]" },
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

export const MyBugStatusBlockContainer = (args) => <BugStatusBlockContainer {...args} />;

MyBugStatusBlockContainer.displayName = "BugStatusBlockContainer";
MyBugStatusBlockContainer.storyName = "BugStatusBlockContainer";
