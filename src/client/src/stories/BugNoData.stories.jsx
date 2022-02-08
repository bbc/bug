import BugNoData from "../core/BugNoData";

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
    },
    argTypes: {
        title: {
            type: { name: "string" },
            defaultValue: "No data found",
            description: "Main text to be displayed in the alert",
            control: {
                type: "text",
            },
        },
        message: {
            type: { name: "string" },
            defaultValue: "",
            description: "Additional message to be displayed",
            control: {
                type: "text",
            },
        },
        panelId: {
            type: { name: "string" },
            description: "Pass in a valid panel id to be used to navigate to the config page",
            defaultValue: "",
        },
        showConfigButton: {
            type: { name: "boolean" },
            control: { type: "boolean" },
            defaultValue: true,
        },
    },
};

export const BugNoData1 = (args) => <BugNoData {...args} />;
BugNoData1.storyName = "BugNoData";
BugNoData1.parameters = {
    title: "No data found",
};
