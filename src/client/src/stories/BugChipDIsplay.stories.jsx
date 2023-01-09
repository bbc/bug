import BugChipDisplay from "@core/BugChipDisplay";

export default {
    title: "BUG Core/Controls/BugChipDisplay",
    component: BugChipDisplay,
    parameters: {
        docs: {
            description: {
                component: `A control for displaying content such as tags<br />`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    decorators: [(Story) => <div style={{ margin: "1em", maxWidth: "300px" }}>{Story()}</div>],

    argTypes: {
        avatar: {
            type: { name: "data" },
            description: "An optional element containing an avatar image to display",
            control: {
                disable: true,
            },
            table: {
                type: { summary: "data" },
                defaultValue: { summary: null },
            },
        },
        options: {
            type: { name: "data", required: true },
            description: "An array of strings to display inside the control",
            defaultValue: ["Option 1", "Option 2", "Option 3"],
            table: {
                type: { summary: "data" },
                defaultValue: { summary: null },
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

export const MyBugChipDisplay = (args) => <BugChipDisplay {...args} />;

MyBugChipDisplay.displayName = "BugChipDisplay";
MyBugChipDisplay.storyName = "BugChipDisplay";
