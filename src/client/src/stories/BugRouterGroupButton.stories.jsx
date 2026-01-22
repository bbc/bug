import BugRouterGroupButton from "@core/BugRouterGroupButton";
import BallotIcon from "@mui/icons-material/Ballot";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Controls, Description, Source, Story, Subtitle, Title } from "@storybook/blocks";

export default {
    title: "BUG Core/Controls/BugRouterGroupButton",
    component: BugRouterGroupButton,
    parameters: {
        docs: {
            page: () => (
                <>
                    <Title />
                    <Subtitle />
                    <Description />
                    <Source
                        language="jsx"
                        dark
                        code={`
import BugRouterGroupButton from "@core/BugRouterGroupButton";
import { BallotIcon, EditIcon, DeleteIcon } from "@mui/icons-material";

<BugRouterGroupButton
    id="group_01"
    primaryLabel="Camera Group"
    onClick={(id) => console.log('Selected:', id)}
    menuItems={[
        { title: "Edit Sources", icon: <BallotIcon fontSize="small" />, onClick: () => {} },
        { title: "-" },
        { title: "Rename", icon: <EditIcon fontSize="small" />, onClick: () => {} },
        { title: "Delete", icon: <DeleteIcon fontSize="small" />, onClick: () => {} },
    ]}
/>`}
                    />
                    <Story />
                    <Controls />
                </>
            ),
            description: {
                component: `A group button used in matrix/router control panels for navigation. Group buttons allow users to switch between different sets of sources or destinations.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    args: {
        id: "button001",
        primaryLabel: "Bugle",
        selected: false,
        editMode: false,
        draggable: false,
        sx: {},
        menuItems: [
            { title: "Edit Sources", icon: <BallotIcon fontSize="small" />, onClick: () => {} },
            { title: "-" },
            { title: "Rename", icon: <EditIcon fontSize="small" />, onClick: () => {} },
            { title: "Delete", icon: <DeleteIcon fontSize="small" />, onClick: () => {} },
        ],
    },

    argTypes: {
        primaryLabel: {
            description: "The main button text, usually showing the group name.",
            table: { type: { summary: "string" } },
        },
        selected: {
            description: "Applies active styling to indicate the current group.",
            table: { type: { summary: "boolean" }, defaultValue: { summary: false } },
        },
        editMode: {
            description: "Enables drag-and-drop and the item context menu.",
            table: { type: { summary: "boolean" }, defaultValue: { summary: false } },
        },
        onClick: {
            description: "Callback fired when the button is clicked.",
            control: { disable: true },
            table: { type: { summary: "function" } },
        },
        menuItems: {
            description: "Array of menu items for the context menu (visible in edit mode).",
            table: { category: "Data", type: { summary: "array" } },
        },
        item: {
            description: "Data object passed back to menu item event handlers.",
            table: { category: "Data", type: { summary: "object" } },
        },
        sx: {
            description: "MUI style overrides.",
            table: { type: { summary: "object" } },
        },
    },
};

export const Default = {
    render: (args) => (
        <div style={{ padding: "40px", display: "flex", justifyContent: "center", background: "#262626" }}>
            <div style={{ width: "160px" }}>
                <BugRouterGroupButton {...args} />
            </div>
        </div>
    ),
};
