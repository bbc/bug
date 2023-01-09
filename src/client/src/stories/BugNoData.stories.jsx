import BugNoData from "@core/BugNoData";

export default {
    title: "BUG Core/Controls/BugNoData",
    component: BugNoData,
    parameters: {
        docs: {
            description: {
                component: `An information panel to be displayed when no data is available. <br />
                    Can optionally redirect user to panel config page if panelId property is provided.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },
    argTypes: {
        message: {
            type: { name: "string" },
            defaultValue: "",
            description: "Additional message to be displayed",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "" },
            },
        },
        panelId: {
            type: { name: "string" },
            description: "Pass in a valid panel id to be used to navigate to the config page",
            defaultValue: "",
            control: {
                disable: true,
            },
        },
        showConfigButton: {
            type: { name: "boolean" },
            defaultValue: true,
            description: "Whether to show the 'configure' action button",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: true },
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
        title: {
            type: { name: "string" },
            defaultValue: "No data found",
            description: "Main text to be displayed in the alert",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "" },
            },
        },
    },
};

export const BugNoData1 = (args) => <BugNoData {...args} />;
BugNoData1.storyName = "BugNoData";
BugNoData1.parameters = {
    title: "No data found",
};
