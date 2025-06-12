import { Box } from "@mui/material";
import { ArgsTable, Description, PRIMARY_STORY, Subtitle, Title } from "@storybook/addon-docs";

export default {
    title: "BUG Core/Controls/BugMenuItems",
    component: Box,
    parameters: {
        docs: {
            description: {
                component: `These menuitems are used in BugToolbarWrapper and BugApiTable<br />
                They are always delivered as an array.<br />
                Each column is an object with the following properties:<br />`,
            },
            page: () => (
                <>
                    <Title />
                    <Subtitle />
                    <Description />
                    <br />
                    <ArgsTable story={PRIMARY_STORY} />
                </>
            ),
        },
        controls: { sort: "requiredFirst" },
    },

    argTypes: {
        icon: {
            type: { name: "data", required: false },
            description: "The icon to be displayed in the menu item - usually a React component",
            control: {
                disable: true,
            },
            table: {
                type: { summary: "data" },
                defaultValue: { summary: null },
            },
        },
        title: {
            type: { name: "string", required: true },
            description: "The text to be displayed in the menu item. Use '-' to show a divider.",
            control: {
                disable: true,
            },
            table: {
                type: { summary: "string" },
                defaultValue: { summary: null },
            },
        },
        onClick: {
            type: { name: "function", required: true },
            defaultValue: null,
            description:
                "This callback is called when the menu item is clicked. It provides an event and item object as parameters.",
            control: {
                disable: true,
            },
            table: {
                type: { summary: "data" },
                defaultValue: { summary: null },
            },
        },
        disabled: {
            type: { name: "function", required: true },
            defaultValue: null,
            description:
                "Can either be boolean, or a callback that returns a boolean. The callback is provided with the item as a parameter.",
            control: {
                disable: true,
            },
            table: {
                type: { summary: "data" },
                defaultValue: { summary: null },
            },
        },
    },
};

export const MyBugMenuItems = (args) => <div {...args} />;
MyBugMenuItems.displayName = "BugMenuItems";
MyBugMenuItems.storyName = "BugMenuItems";
MyBugMenuItems.args = {};
