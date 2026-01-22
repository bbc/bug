import BugContextMenu from "@core/BugContextMenu";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Box, IconButton } from "@mui/material";
import { Controls, Description, Source, Story, Subtitle, Title } from "@storybook/blocks";
import { useState } from "react";

export default {
    title: "BUG Core/Controls/BugContextMenu",
    component: BugContextMenu,
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
import React, { useState } from "react";
import BugContextMenu from "@core/BugContextMenu";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton } from "@mui/material";

export default function MyComponent() {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const menuItems = [
        { title: "Edit", onClick: () => console.log("Edit clicked") },
        { title: "Delete", onClick: () => console.log("Delete clicked") },
    ];

    return (
        <>
            <IconButton onClick={handleClick}>
                <MoreVertIcon />
            </IconButton>
            <BugContextMenu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                menuItems={menuItems}
            />
        </>
    );
}`}
                    />
                    <Story />
                    <Controls />
                </>
            ),
            description: {
                component: `A context menu component that accepts an array of **BugMenuItems**. <br />
                It is designed to be anchored to a specific HTML element or pointer position triggered by user events.`,
            },
        },
        controls: { sort: "requiredFirst" },
    },

    args: {
        menuItems: [
            { title: "Option 1", onClick: () => alert("Option 1 clicked") },
            { title: "Option 2", onClick: () => alert("Option 2 clicked") },
            { title: "Option 3", onClick: () => alert("Option 3 clicked"), disabled: true },
        ],
    },

    argTypes: {
        item: {
            description: "The item associated with the context menu",
            table: { type: { summary: "any" }, defaultValue: { summary: "null" } },
        },
        menuItems: {
            description: "An array of menuitems to be shown via the menu",
            table: { type: { summary: "array" }, defaultValue: { summary: "[]" } },
        },
        anchorEl: {
            description: "The HTML element used to position the menu",
            table: { type: { summary: "HTMLElement" }, defaultValue: { summary: "null" } },
        },
        onClose: {
            description: "Callback fired when the menu requests to close",
            control: { disable: true },
            table: { type: { summary: "function" } },
        },
    },
};

export const Default = {
    render: (args) => {
        const [anchorEl, setAnchorEl] = useState(null);

        const handleClick = (event) => {
            event.stopPropagation();
            setAnchorEl(event.currentTarget);
        };

        const handleClose = () => {
            setAnchorEl(null);
        };

        return (
            <div style={{ padding: "20px", maxWidth: "600px" }}>
                <Box>
                    <IconButton size="small" sx={{ padding: "4px" }} onClick={handleClick}>
                        <MoreVertIcon />
                    </IconButton>
                    <BugContextMenu {...args} anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose} />
                </Box>
            </div>
        );
    },
};
