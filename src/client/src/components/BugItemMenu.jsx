import MoreVertIcon from "@mui/icons-material/MoreVert";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import React from "react";

const StyledListItemText = styled(ListItemText)(({ theme }) => ({
    color: theme.palette.text.primary,
}));

export default function BugItemMenu({ item, menuItems }) {
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

    const getIcon = (icon) => {
        if (typeof icon === "function") {
            return icon(item);
        }
        return icon;
    };

    return (
        <div>
            <IconButton
                component="span"
                sx={{
                    padding: "4px",
                }}
                aria-label="menu"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleOpenMenuClick}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                {menuItems
                    .filter((menuItem) => menuItem !== null)
                    .map((menuItem, index) => {
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
                                    <StyledListItemText primary={menuItem.title} />
                                </MenuItem>
                            );
                        }
                    })}
            </Menu>
        </div>
    );
}
