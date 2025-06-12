import { Box } from "@mui/material";
import { ArgsTable, Description, PRIMARY_STORY, Subtitle, Title } from "@storybook/addon-docs";

export default {
    title: "BUG Core/Controls/BugContextMenu",
    component: Box,
    parameters: {
        docs: {
            description: {
                component: `This is a context menu which accepts BugMenuItems`,
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
        menuItems: {
            type: { name: "data", required: true },
            description: "An array of menuitems to be shown via the menu",
            table: {
                type: { summary: "data" },
                defaultValue: { summary: "[]" },
            },
        },
        item: {
            type: { name: "object", required: false },
            description: "An optional object which is passed as a parameter when click event is fired",
            control: {
                disable: true,
            },
            table: {
                type: { summary: "object" },
                defaultValue: { summary: null },
            },
        },
        anchorEl: {
            type: { name: "data", required: true },
            description:
                "An HTML element or function that returns one which is used to set the location of the context menu",
            table: {
                type: { summary: "data" },
                defaultValue: { summary: "null" },
            },
        },
        onClose: {
            type: { name: "function", required: true },
            defaultValue: null,
            description: "This callback is called when the menu requests to be closed",
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

export const MyBugContextMenu = (args) => <div {...args} />;
MyBugContextMenu.displayName = "BugContextMenu";
MyBugContextMenu.storyName = "BugContextMenu";
MyBugContextMenu.args = {};
