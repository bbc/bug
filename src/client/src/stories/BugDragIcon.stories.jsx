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

export const MyBugDragIcon = (args) => <BugDragIcon {...args} />;

MyBugDragIcon.displayName = "BugDragIcon";
MyBugDragIcon.storyName = "BugDragIcon";
