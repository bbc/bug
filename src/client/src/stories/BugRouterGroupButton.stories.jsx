import BugRouterGroupButton from "@core/BugRouterGroupButton";
import DeleteIcon from "@mui/icons-material/Delete";
import BallotIcon from "@mui/icons-material/Ballot";
import EditIcon from "@mui/icons-material/Edit";

export default {
    title: "BUG Core/Controls/BugRouterGroupButton",
    component: BugRouterGroupButton,
    parameters: {
        docs: {
            description: {
                component: `A group button which forms part of a matrix/router control panel.<br />
                Group buttons are used to navigate between groups of sources/destinations in the panel page.<br />
                It's fully customisable and also features drag-and-drop capabilities.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    argTypes: {
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
        item: {
            type: { name: "data" },
            description: "An object which is passed back on event handlers in the item menu",
            defaultValue: null,
            table: {
                type: { summary: "data" },
                defaultValue: { summary: null },
            },
        },
        menuItems: {
            type: "data",
            control: {
                disable: true,
            },

            defaultValue: [
                {
                    title: `Edit Sources`,
                    icon: <BallotIcon fontSize="small" />,
                    onClick: () => {},
                },
                {
                    title: "-",
                },
                {
                    title: "Rename",
                    icon: <EditIcon fontSize="small" />,
                    onClick: () => {},
                },
                {
                    title: "Delete",
                    icon: <DeleteIcon fontSize="small" />,
                    onClick: () => {},
                },
            ],

            description: "An array of menuitems to be shown via the context menu",
            table: {
                type: { summary: "data" },
                defaultValue: { summary: "[]" },
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
            description: "The main button text. Usually shows the group name",
            defaultValue: "Bugle",
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
    },
};

export const MyApiSaveButton = (args) => <BugRouterGroupButton {...args} />;
MyApiSaveButton.displayName = "BugRouterGroupButton";
MyApiSaveButton.storyName = "BugRouterGroupButton";
MyApiSaveButton.parameters = {
    docs: {
        source: {
            code: `
<BugRouterGroupButton
    id="button001"
    item={myItem}
    menuItems={[
        {
            icon: <BallotIcon fontSize="small" />,
            onClick: () => {},
            title: 'Edit Sources'
        },
        {
            title: '-'
        },
        {
            icon: <EditIcon fontSize="small" />,
            onClick: function noRefCheck() {},
            title: 'Rename'
        },
        {
            icon: <DeleteIcon fontSize="small" />,
            onClick: function noRefCheck() {},
            title: 'Delete'
        }
    ]}
    onClick={handleClick}
    primaryLabel="Bugle"
/>
`,
        },
    },
};
