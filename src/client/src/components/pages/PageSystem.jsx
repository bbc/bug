import React, { useEffect } from "react";
import { makeStyles } from "@mui/styles";
import { useDispatch } from "react-redux";
import pageTitleSlice from "@redux/pageTitleSlice";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import SecurityIcon from "@mui/icons-material/Security";
import SystemUpdateAltIcon from "@mui/icons-material/SystemUpdateAlt";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InfoIcon from "@mui/icons-material/Info";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBug } from "@fortawesome/free-solid-svg-icons";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";

const useStyles = makeStyles(async (theme) => ({
    list: {
        backgroundColor: theme.palette.background.paper,
        maxWidth: 550,
        "& .MuiListItem-root": {
            borderBottom: "1px solid #121212",
        },
        padding: 0,
        margin: "8px auto",
    },
    navIcon: {
        minWidth: "auto",
    },
}));

export default function PageSystem() {
    const classes = useStyles();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(pageTitleSlice.actions.set("System"));
    }, [dispatch]);

    return (
        <>
            <List className={classes.list}>
                <ListItem button component={Link} to={`/system/about`}>
                    <ListItemIcon>
                        <FontAwesomeIcon size="lg" icon={faBug} />
                    </ListItemIcon>
                    <ListItemText
                        primary="About BUG"
                        secondary="Links to documentation, help and more information about BUG"
                    />
                    <ListItemIcon className={classes.navIcon}>
                        <ChevronRightIcon />
                    </ListItemIcon>
                </ListItem>
            </List>
            <List className={classes.list}>
                <ListItem button component={Link} to={`/system/configuration`}>
                    <ListItemIcon>
                        <SettingsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Global Configuration" secondary="Configure global settings and options" />
                    <ListItemIcon className={classes.navIcon}>
                        <ChevronRightIcon />
                    </ListItemIcon>
                </ListItem>
                <ListItem button component={Link} to={`/panels`}>
                    <ListItemIcon>
                        <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Panels" secondary="Configure and maintain the panels on this BUG" />
                    <ListItemIcon className={classes.navIcon}>
                        <ChevronRightIcon />
                    </ListItemIcon>
                </ListItem>
            </List>
            <List className={classes.list}>
                <ListItem button component={Link} to={`/system/users`}>
                    <ListItemIcon>
                        <PeopleIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary="Users"
                        secondary="Manage usernames and passwords for access to this server"
                    />
                    <ListItemIcon className={classes.navIcon}>
                        <ChevronRightIcon />
                    </ListItemIcon>
                </ListItem>
                <ListItem button component={Link} to={`/system/security`}>
                    <ListItemIcon>
                        <SecurityIcon />
                    </ListItemIcon>
                    <ListItemText primary="Security" secondary="Configure authentication methods and options" />
                    <ListItemIcon className={classes.navIcon}>
                        <ChevronRightIcon />
                    </ListItemIcon>
                </ListItem>
            </List>
            <List className={classes.list}>
                <ListItem button component={Link} to={`/system/backup`}>
                    <ListItemIcon>
                        <SettingsBackupRestoreIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary="Backup & Restore"
                        secondary="Download a complete backup or restore from file"
                    />
                    <ListItemIcon className={classes.navIcon}>
                        <ChevronRightIcon />
                    </ListItemIcon>
                </ListItem>
                <ListItem button component={Link} to={`/system/software`}>
                    <ListItemIcon>
                        <SystemUpdateAltIcon />
                    </ListItemIcon>
                    <ListItemText primary="Software" secondary="View and install available software updates" />
                    <ListItemIcon className={classes.navIcon}>
                        <ChevronRightIcon />
                    </ListItemIcon>
                </ListItem>
                <ListItem button component={Link} to={`/system/info`}>
                    <ListItemIcon>
                        <InfoIcon />
                    </ListItemIcon>
                    <ListItemText primary="System" secondary="CPU, RAM and disk information" />
                    <ListItemIcon className={classes.navIcon}>
                        <ChevronRightIcon />
                    </ListItemIcon>
                </ListItem>
                <ListItem button component={Link} to={`/system/logs`}>
                    <ListItemIcon>
                        <ReceiptIcon />
                    </ListItemIcon>
                    <ListItemText primary="Logs" secondary="View application and module logs" />
                    <ListItemIcon className={classes.navIcon}>
                        <ChevronRightIcon />
                    </ListItemIcon>
                </ListItem>
            </List>
        </>
    );
}
