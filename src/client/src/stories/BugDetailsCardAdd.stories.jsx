import BugDetailsCardAdd from "@core/BugDetailsCardAdd";

export default {
    title: "BUG Core/Layout/BugDetailsCardAdd",
    component: BugDetailsCardAdd,
    parameters: {
        docs: {
            description: {
                component: `Useful when you want to allow users to add card content.<br />
                Often used in codecs and other devices where you have dynamic content to display.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    decorators: [(Story) => <div style={{ margin: "1em", maxWidth: "300px" }}>{Story()}</div>],

    argTypes: {
        width: {
            type: { name: "string", required: false },
            defaultValue: "10rem",
            description: "The width of the card - can be in any valid CSS unit",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "10rem" },
            },
        },
        onAdd: {
            type: { name: "data", required: true },
            control: { disable: true },
            description: "Provides a callback when the card button is clicked",
            table: {
                type: { summary: "function" },
                defaultValue: { summary: null },
            },
        },
    },
};

export const MyBugDetailsCardAdd = (args) => <BugDetailsCardAdd {...args} />;

MyBugDetailsCardAdd.displayName = "BugDetailsCardAdd";
MyBugDetailsCardAdd.storyName = "BugDetailsCardAdd";
