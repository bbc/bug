import React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";

export default function BugContextMenu({ item, menuItems, anchorEl, onClose }) {
    const open = Boolean(anchorEl);

    const handleMenuItemClicked = (event, menuItem) => {
        onClose();
        event.stopPropagation();
        event.preventDefault();
        if (menuItem.disabled !== true && typeof menuItem.onClick === "function") {
            menuItem.onClick(event, item);
        }
    };

    const parseDisabled = (disabledValue) => {
        if (disabledValue === undefined) {
            return false;
        }

        if (typeof disabledValue === "function") {
            return disabledValue(item);
        }

        return disabledValue;
    };

    const getIcon = (icon) => {
        if (typeof icon === "function") {
            return icon(item);
        }
        return icon;
    };

    if (menuItems) {
        return null;
    }

    return (
        <div>
            <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
                {menuItems.map((menuItem, index) => {
                    if (menuItem.title === "-") {
                        return <Divider key={index} />;
                    } else {
                        return (
                            <MenuItem
                                onClick={(event) => handleMenuItemClicked(event, menuItem)}
                                key={index}
                                disabled={parseDisabled(menuItem.disabled)}
                            >
                                <ListItemIcon disabled={parseDisabled(menuItem.disabled)}>
                                    {getIcon(menuItem.icon)}
                                </ListItemIcon>
                                <ListItemText primary={menuItem.title} />
                            </MenuItem>
                        );
                    }
                })}
            </Menu>
        </div>
    );
}
