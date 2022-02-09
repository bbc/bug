import BugLoading from "@core/BugLoading";

export default {
    title: "BUG Core/Controls/BugLoading",
    component: BugLoading,
    parameters: {
        docs: {
            description: {
                component: `A spinning icon to be displayed when items are loading.`,
            },
        },
    },
    argTypes: {
        height: {
            type: { name: "string" },
            defaultValue: "200px",
            description: "The height of the container - can be in any valid CSS unit",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "100vh" },
            },
        },
    },
};

export const BugLoading1 = (args) => <BugLoading {...args} />;
BugLoading1.storyName = "BugLoading";
