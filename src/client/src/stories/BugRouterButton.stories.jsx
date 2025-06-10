import BugRouterButton from "@core/BugRouterButton";

export default {
    title: "BUG Core/Controls/BugRouterButton",
    component: BugRouterButton,
    parameters: {
        docs: {
            description: {
                component: `A button which forms part of a matrix/router control panel.<br />
                It's fully customisable and also features drag-and-drop capabilities.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    argTypes: {
        disabled: {
            type: { name: "boolean" },
            defaultValue: false,
            description: "Whether the control is disabled",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: false },
            },
        },
        draggable: {
            type: { name: "boolean" },
            defaultValue: false,
            description: "Whether the control is draggable",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: false },
            },
        },
        editMode: {
            type: { name: "boolean" },
            defaultValue: false,
            description: "Whether the control is in edit mode (allows drag/drop and access to item menu)",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: false },
            },
        },
        id: {
            type: { name: "string" },
            description: "A unique identifier for the control",
            defaultValue: "button001",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: null },
            },
        },
        icon: {
            type: { name: "string" },
            description: "An icon to be displayed in the button. Can be MUI or Material Display icon",
            defaultValue: "mdi-bugle",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: null },
            },
        },
        lefticon: {
            type: { name: "string" },
            description:
                "Optional small indicator icon to be displayed in the top left of the button. Can be MUI or Material Display icon",
            defaultValue: "",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: null },
            },
        },
        iconColor: {
            control: "color",
            description: "The color of the icon to be displayed in the button.",
            defaultValue: "#ffffff",
            table: {
                type: { summary: "color" },
                defaultValue: { summary: null },
            },
        },
        item: {
            type: { name: "data" },
            description: "An object which is passed back on event handlers in the item menu",
            defaultValue: null,
            table: {
                type: { summary: "data" },
                defaultValue: { summary: null },
            },
        },
        locked: {
            type: { name: "boolean" },
            defaultValue: false,
            description: "Whether the router button is locked",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: false },
            },
        },
        menuItems: {
            type: "data",
            description: "An array of menuitems to be shown via the context menu",
            table: {
                type: { summary: "data" },
                defaultValue: { summary: "[]" },
            },
        },
        number: {
            type: { name: "number" },
            description: "The source or destination index to be displayed inside the button when there is no icon",
            defaultValue: 1,
            table: {
                type: { summary: "number" },
                defaultValue: { summary: null },
            },
        },
        onClick: {
            type: { name: "function", required: true },
            defaultValue: null,
            description: "This callback is called when the button is clicked",
            control: {
                disable: true,
            },
            table: {
                type: { summary: "data" },
                defaultValue: { summary: null },
            },
        },
        primaryLabel: {
            type: { name: "string" },
            description: "The main button text. Usually shows the source or destination name",
            defaultValue: "Bugle",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: null },
            },
        },
        secondaryLabel: {
            type: { name: "string" },
            description: "The secondary button text. For a destination, usually shows source",
            defaultValue: "Cornet",
            table: {
                type: { summary: "string" },
                defaultValue: { summary: null },
            },
        },
        selected: {
            type: { name: "boolean" },
            defaultValue: false,
            description: "Whether the router button is selected",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: false },
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
        useDoubleClick: {
            type: { name: "boolean" },
            defaultValue: false,
            description: "Whether the router button requires a double-click to take",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: false },
            },
        },
    },
};

export const MyApiSaveButton = (args) => <BugRouterButton {...args} />;
MyApiSaveButton.displayName = "BugRouterButton";
MyApiSaveButton.storyName = "BugRouterButton";
