import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import MoreIcon from "@material-ui/icons/MoreVert";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import DeleteIcon from "@material-ui/icons/Delete";
import ToggleOffIcon from "@material-ui/icons/ToggleOff";
import ToggleOnIcon from "@material-ui/icons/ToggleOn";
import { Hidden } from "@material-ui/core";
import BadgeWrapper from "@components/BadgeWrapper";
import SettingsIcon from "@material-ui/icons/Settings";
import NotificationsIcon from "@material-ui/icons/Notifications";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
    dropdownMenu: {
        marginLeft: "-0.5rem",
    },
}));

/*
 * this has optional properties:
 * - buttons - which can take buttons with links to show on the toolbar
 * - menuitems - which can take menuitems which will be shown in the list
 */

export default function PanelToolbar(props) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const panel = useSelector((state) => state.panel);

    const handleOpenMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    if (panel.status === "loading") {
        return null;
    }
    if (panel.status === "success") {
        return (
            <>
                <Hidden xsDown>
                    <Button
                        component={Link}
                        to={`/panel/${panel.data.id}/edit`}
                        color="default"
                        startIcon={
                            <BadgeWrapper
                                panel={panel.data}
                                position={{
                                    vertical: "top",
                                    horizontal: "left",
                                }}
                            >
                                <NotificationsIcon />
                            </BadgeWrapper>
                        }
                    ></Button>
                    <Button
                        component={Link}
                        to={`/panel/${panel.data.id}/edit`}
                        variant="outlined"
                        color="default"
                        startIcon={<SettingsIcon />}
                    >
                        Edit Panel
                    </Button>
                    {props.buttons}
                </Hidden>
                <IconButton
                    className={classes.dropdownMenu}
                    aria-label="more"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    onClick={handleOpenMenuClick}
                >
                    <MoreIcon />
                </IconButton>
                <Menu anchorEl={anchorEl} open={open} onClose={handleClose} onClick={handleClose}>
                    <MenuItem component={Link} to={`/panel/${panel.data.id}/edit`}>
                        <ListItemIcon>
                            <SettingsIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Edit Panel" />
                    </MenuItem>
                    {props.menuItems}
                    <Divider />
                    <MenuItem disabled>
                        <ListItemIcon>
                            <ToggleOnIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Enable Panel" />
                    </MenuItem>
                    <MenuItem>
                        <ListItemIcon>
                            <ToggleOffIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Disable Panel" />
                    </MenuItem>
                    <MenuItem>
                        <ListItemIcon>
                            <DeleteIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Delete Panel" />
                    </MenuItem>
                </Menu>
            </>
        );
    }
    return null;
}
