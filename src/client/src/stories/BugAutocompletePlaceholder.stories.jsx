import BugAutocompletePlaceholder from "../core/BugAutocompletePlaceholder";

export default {
    title: "BUG Core/Data/BugAutocompletePlaceholder",
    component: BugAutocompletePlaceholder,
    parameters: {
        docs: {
            description: {
                component: `A placeholder control to use when a BugAutoComplete control is loading`,
            },
        },
    },

    decorators: [(Story) => <div style={{ margin: "1em", maxWidth: "300px" }}>{Story()}</div>],

    argTypes: {
        value: {
            type: { name: "string", required: true },
            defaultValue: "Loading ...",
            description: "The text to display inside the control",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "" },
            },
        },
    },
};

export const MyBugAutocompletePlaceholder = (args) => <BugAutocompletePlaceholder {...args} />;
MyBugAutocompletePlaceholder.displayName = "BugAutocompletePlaceholder";
MyBugAutocompletePlaceholder.storyName = "BugAutocompletePlaceholder";
