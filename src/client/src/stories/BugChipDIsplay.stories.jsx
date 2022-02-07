import BugChipDisplay from "../core/BugChipDisplay";

export default {
    title: "BUG Core/Data/BugChipDisplay",
    component: BugChipDisplay,
    parameters: {
        docs: {
            description: {
                component: `A control for displaying content such as tags<br />`,
            },
        },
    },

    decorators: [(Story) => <div style={{ margin: "1em", maxWidth: "300px" }}>{Story()}</div>],

    argTypes: {
        options: {
            type: { name: "data", required: true },
            description: "An array of strings to display inside the control",
            defaultValue: ["Option 1", "Option 2", "Option 3"],
            table: {
                type: { summary: "data" },
                defaultValue: { summary: null },
            },
        },
    },
};

export const MyBugChipDisplay = (args) => <BugChipDisplay {...args} />;

MyBugChipDisplay.displayName = "BugChipDisplay";
MyBugChipDisplay.storyName = "BugChipDisplay";
