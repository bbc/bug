import BugCountdownSpinner from "@core/BugCountdownSpinner";

export default {
    title: "BUG Core/Controls/BugCountdownSpinner",
    component: BugCountdownSpinner,
    parameters: {
        docs: {
            description: {
                component: `A circular progress icon which counts down over a specified duration.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },
    argTypes: {
        duration: {
            type: { name: "number" },
            description: "Duration over which the progress should count down",
            defaultValue: 5000,
            table: {
                type: { summary: "number" },
                defaultValue: { summary: 5000 },
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

export const BugCountdownSpinner1 = (args) => <BugCountdownSpinner {...args} />;
BugCountdownSpinner1.storyName = "BugCountdownSpinner";
