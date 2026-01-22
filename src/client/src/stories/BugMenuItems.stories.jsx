import { Controls, Description, Subtitle, Title } from "@storybook/blocks";

export default {
    title: "BUG Core/Controls/BugMenuItems",
    // We use a div or fragment since BugMenuItems is a data structure, not a component
    component: "div",
    parameters: {
        docs: {
            page: () => (
                <>
                    <Title />
                    <Subtitle />
                    <Description />
                    <Controls />
                </>
            ),
            description: {
                component: `These menu items are used in **BugToolbarWrapper**, **BugApiTable**, and **BugContextMenu**.<br />
                They are always delivered as an array of objects.<br />
                Each object in the array supports the following properties:`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    argTypes: {
        title: {
            description: "The text to be displayed. Use **'-'** to render a divider line.",
            type: { name: "string", required: true },
            table: {
                type: { summary: "string" },
            },
        },
        icon: {
            description: "An icon component (usually from MUI or BugDynamicIcon) to display next to the text.",
            table: {
                type: { summary: "element" },
            },
        },
        onClick: {
            description: "Callback fired when the item is clicked. Receives (event, item) as arguments.",
            table: {
                type: { summary: "function" },
            },
        },
        disabled: {
            description: "Either a boolean or a function returning a boolean: **(item) => boolean**.",
            table: {
                type: { summary: "boolean | function" },
            },
        },
        hidden: {
            description: "Either a boolean or a function returning a boolean to conditionally hide the item.",
            table: {
                type: { summary: "boolean | function" },
            },
        },
    },
};

export const Default = {
    render: () => (
        <div
            style={{
                padding: "20px",
                color: "#666",
                fontStyle: "italic",
                border: "1px dashed #ccc",
                maxWidth: "600px",
            }}
        >
            This component does not render directly. It defines the object structure used by menus and toolbars. Refer
            to the properties table below for implementation.
        </div>
    ),
};
