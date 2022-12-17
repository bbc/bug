import BugDragIcon from "@core/BugDragIcon";

export default {
    title: "BUG Core/Icons/BugDragIcon",
    component: BugDragIcon,
    parameters: {
        docs: {
            description: {
                component: `A handy drag icon to use in tables to indicate that the content is draggable.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    decorators: [(Story) => <div style={{ margin: "1em", maxWidth: "300px" }}>{Story()}</div>],

    argTypes: {
        color: {
            options: ["primary", "secondary"],
            description: "The color type to display (primary, secondary)",
            defaultValue: "primary",
            control: { type: "select" },
            table: {
                type: { summary: "string" },
                defaultValue: { summary: "primary" },
            },
        },
    },
};

export const MyBugDragIcon = (args) => <BugDragIcon {...args} />;

MyBugDragIcon.displayName = "BugDragIcon";
MyBugDragIcon.storyName = "BugDragIcon";
