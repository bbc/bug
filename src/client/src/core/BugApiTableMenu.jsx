import React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";

export default function BugApiTableMenu({ item, menuItems }) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleOpenMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
        event.stopPropagation();
        event.preventDefault();
    };

    const handleClose = (event) => {
        setAnchorEl(null);
        event.stopPropagation();
        event.preventDefault();
    };

    const handleMenuItemClicked = (event, menuItem) => {
        setAnchorEl(null);
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

    return (
        <div>
            <IconButton aria-label="more" aria-controls="long-menu" aria-haspopup="true" onClick={handleOpenMenuClick}>
                <MoreVertIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
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
                                <ListItemIcon disabled={parseDisabled(menuItem.disabled)}>{menuItem.icon}</ListItemIcon>
                                <ListItemText primary={menuItem.title} />
                            </MenuItem>
                        );
                    }
                })}
            </Menu>
        </div>
    );
}
