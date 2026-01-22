import BugNoData from "@core/BugNoData";
import { Controls, Description, Story, Subtitle, Title } from "@storybook/blocks";

export default {
    title: "BUG Core/Controls/BugNoData",
    component: BugNoData,
    parameters: {
        docs: {
            page: () => (
                <>
                    <Title />
                    <Subtitle />
                    <Description />
                    <Story />
                    <Controls />
                </>
            ),
            description: {
                component: `An information panel to be displayed when no data is available. <br />
                    Can optionally redirect users to the panel config page if the <b>panelId</b> property is provided.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    args: {
        title: "No data found",
        message: "Try adjusting your filters or check the connection.",
        showConfigButton: true,
        sx: {},
    },

    argTypes: {
        title: {
            description: "Main text to be displayed in the alert",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "No data found" },
            },
        },
        message: {
            description: "Additional message to be displayed below the title",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "" },
            },
        },
        showConfigButton: {
            description: "Whether to show the 'configure' action button",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: "true" },
            },
        },
        panelId: {
            description: "Pass in a valid panel id to enable navigation to the config page",
            control: { disable: true },
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "" },
            },
        },
        sx: {
            description: "MUI style overrides (the sx prop)",
            table: {
                type: { summary: "object" },
                defaultValue: { summary: "{}" },
            },
        },
    },
};

export const Default = {
    render: (args) => (
        <div style={{ padding: "20px" }}>
            <BugNoData {...args} />
        </div>
    ),
};
