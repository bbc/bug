import BugColorPicker from "../core/BugColorPicker";

export default {
    title: "BUG Core/Data/BugColorPicker",
    component: BugColorPicker,
    parameters: {
        docs: {
            description: {
                component: `A control for displaying content such as tags<br />`,
            },
        },
    },

    decorators: [(Story) => <div style={{ margin: "1em", maxWidth: "300px" }}>{Story()}</div>],

    argTypes: {
        onColorChange: { action: "changed", table: { disable: true } },
        color: {
            control: "color",
            description: "The selected color",
            defaultValue: "#ff3822",
            table: {
                type: { summary: "color" },
                defaultValue: { summary: null },
            },
        },
    },
};

export const MyBugColorPicker = (args) => <BugColorPicker {...args} />;

MyBugColorPicker.displayName = "BugColorPicker";
MyBugColorPicker.storyName = "BugColorPicker";