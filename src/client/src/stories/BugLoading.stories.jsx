import BugLoading from "@core/BugLoading";
import { Controls, Description, Story, Subtitle, Title } from "@storybook/blocks";

export default {
    title: "BUG Core/Controls/BugLoading",
    component: BugLoading,
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
                component: `A spinning icon to be displayed when items are loading.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    args: {
        height: "100px",
        sx: {},
    },

    argTypes: {
        height: {
            description: "The height of the loading container - can be in any valid CSS unit.",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "100vh" },
            },
        },
        sx: {
            description: "MUI style overrides (the sx prop).",
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
            <BugLoading {...args} />
        </div>
    ),
};
