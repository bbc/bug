import BugToolbarWrapper from "@core/BugToolbarWrapper";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import SettingsIcon from "@mui/icons-material/Settings";
import { Button, ListItemIcon, ListItemText, MenuItem } from "@mui/material";
import { Controls, Description, Source, Story, Subtitle, Title } from "@storybook/blocks";

export default {
    title: "BUG Core/Wrappers/BugToolbarWrapper",
    component: BugToolbarWrapper,
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
import React from "react";
import BugToolbarWrapper from "@core/BugToolbarWrapper";
import { MenuItem, ListItemIcon, ListItemText, Button } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

export default function Toolbar(props) {
    const menuItems = [
        <MenuItem onClick={() => {}} key="launch">
            <ListItemIcon><OpenInNewIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Goto Webpage" />
        </MenuItem>
    ];

    const buttons = [
        <Button key="save" variant="contained">Save</Button>
    ];

    return <BugToolbarWrapper buttons={buttons} menuItems={menuItems} />;
}`}
                    />
                    <Story />
                    <Controls />
                </>
            ),
            description: {
                component: `A layout wrapper for module toolbars. It standardizes the positioning of action buttons (left) and a secondary 'more' menu (right).`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    args: {
        buttons: [],
        menuItems: [],
    },

    argTypes: {
        buttons: {
            description: "An array of React elements (usually Buttons) to be displayed on the left of the toolbar.",
            table: { type: { summary: "ReactNode[]" }, defaultValue: { summary: "[]" } },
        },
        menuItems: {
            description: "An array of MenuItem components to be displayed inside the 'more' dropdown menu.",
            table: { type: { summary: "ReactNode[]" }, defaultValue: { summary: "[]" } },
        },
    },
};

export const Default = {
    render: (args) => {
        // Create concrete elements for the preview
        const demoButtons = [
            <Button key="1" variant="outlined" size="small" startIcon={<SettingsIcon />}>
                Configure
            </Button>,
            <Button key="2" variant="contained" size="small" color="primary">
                Apply
            </Button>,
        ];

        const demoMenu = [
            <MenuItem key="web" onClick={() => alert("Launching...")}>
                <ListItemIcon>
                    <OpenInNewIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Open Web Interface" />
            </MenuItem>,
            <MenuItem key="reboot" onClick={() => alert("Rebooting...")}>
                <ListItemIcon>
                    <PowerSettingsNewIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Reboot Device" />
            </MenuItem>,
        ];

        return (
            <div style={{ padding: "20px", width: "100%", background: "#222", borderRadius: "4px" }}>
                <BugToolbarWrapper
                    {...args}
                    buttons={args.buttons.length > 0 ? args.buttons : demoButtons}
                    menuItems={args.menuItems.length > 0 ? args.menuItems : demoMenu}
                />
            </div>
        );
    },
};
