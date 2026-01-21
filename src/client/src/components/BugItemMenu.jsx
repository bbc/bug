import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Divider, IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";

const StyledListItemText = styled(ListItemText)(({ theme }) => ({
    color: theme.palette.text.primary,
}));

export default function BugItemMenu({ item, menuItems }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const isOpen = Boolean(anchorEl);

    // helper to stop event propagation and closing the menu
    const stopAndClose = (event) => {
        event.stopPropagation();
        event.preventDefault();
        setAnchorEl(null);
    };

    const handleOpen = (event) => {
        event.stopPropagation();
        event.preventDefault();
        setAnchorEl(event.currentTarget);
    };

    const handleItemClick = (event, menuItem) => {
        const isDisabled = resolveValue(menuItem.disabled, item);

        stopAndClose(event);

        if (!isDisabled && typeof menuItem.onClick === "function") {
            menuItem.onClick(event, item);
        }
    };

    // generic helper to handle both static values and function-based props
    const resolveValue = (value, context) => {
        return typeof value === "function" ? value(context) : value;
    };

    return (
        <div>
            <IconButton size="small" sx={{ padding: "4px" }} onClick={handleOpen}>
                <MoreVertIcon />
            </IconButton>

            <Menu anchorEl={anchorEl} open={isOpen} onClose={stopAndClose}>
                {menuItems.filter(Boolean).map((menuItem, index) => {
                    // render divider for shorthand title
                    if (menuItem.title === "-") {
                        return <Divider key={`divider-${index}`} />;
                    }

                    const isDisabled = resolveValue(menuItem.disabled, item);
                    const icon = resolveValue(menuItem.icon, item);

                    return (
                        <MenuItem
                            key={`menu-item-${index}`}
                            onClick={(e) => handleItemClick(e, menuItem)}
                            disabled={isDisabled}
                        >
                            {icon && <ListItemIcon>{icon}</ListItemIcon>}
                            <StyledListItemText primary={menuItem.title} />
                        </MenuItem>
                    );
                })}
            </Menu>
        </div>
    );
}
