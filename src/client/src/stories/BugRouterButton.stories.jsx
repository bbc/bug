import BugRouterButton from "@core/BugRouterButton";
import { Controls, Description, Story, Subtitle, Title } from "@storybook/blocks";

export default {
    title: "BUG Core/Controls/BugRouterButton",
    component: BugRouterButton,
    parameters: {
        docs: {
            page: () => (
                <>
                    <Title />
                    <Subtitle />
                    <Description />
                    <Story />
                    <Controls />
                </>
            ),
            description: {
                component: `A button specifically designed for matrix and router control panels. It supports multiple label layers, icon states, and drag-and-drop functionality.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    args: {
        id: "button001",
        primaryLabel: "Bugle",
        secondaryLabel: "Cornet",
        tertiaryLabel: "Button 1",
        number: 1,
        icon: "MusicNote",
        iconColor: "#ffffff",
        iconSize: "medium",
        selected: false,
        locked: false,
        disabled: false,
        draggable: false,
        editMode: false,
        wide: false,
        useDoubleClick: false,
        sx: {},
    },

    argTypes: {
        primaryLabel: {
            description: "The main button text. Usually shows the source or destination name.",
            table: { type: { summary: "string" } },
        },
        secondaryLabel: {
            description: "The secondary button text. For a destination, usually shows the current source.",
            table: { type: { summary: "string" } },
        },
        tertiaryLabel: {
            description: "Text shown at the top of the button, often for destination descriptions.",
            table: { type: { summary: "string" } },
        },
        icon: {
            description: "An icon name (MUI or MDI) to be displayed.",
            table: { type: { summary: "string" } },
        },
        iconColor: {
            control: "color",
            description: "The color of the icon.",
            table: { type: { summary: "string" } },
        },
        iconSize: {
            options: ["small", "medium"],
            control: { type: "select" },
            description: "The size of the icon.",
            table: { type: { summary: "string" }, defaultValue: { summary: "medium" } },
        },
        selected: {
            description: "Highlights the button to indicate selection.",
            table: { type: { summary: "boolean" }, defaultValue: { summary: false } },
        },
        editMode: {
            description: "Enables drag/drop and context menu access.",
            table: { type: { summary: "boolean" }, defaultValue: { summary: false } },
        },
        onClick: {
            description: "Callback fired when the button is clicked.",
            control: { disable: true },
            table: { type: { summary: "function" } },
        },
        sx: {
            description: "MUI style overrides.",
            table: { type: { summary: "object" } },
        },
        // Grouping data-heavy props
        menuItems: { table: { category: "Data", type: { summary: "array" } } },
        item: { table: { category: "Data", type: { summary: "object" } } },
    },
};

export const Default = {
    render: (args) => (
        <div
            style={{
                padding: "20px",
                background: "#262626",
                display: "flex",
                justifyContent: "center",
            }}
        >
            <BugRouterButton {...args} />
        </div>
    ),
};
