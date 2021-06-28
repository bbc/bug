import React, { useEffect } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import pageTitleSlice from "@redux/pageTitleSlice";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import PeopleIcon from "@material-ui/icons/People";
import SettingsIcon from "@material-ui/icons/Settings";
import SecurityIcon from "@material-ui/icons/Security";
import SystemUpdateAltIcon from "@material-ui/icons/SystemUpdateAlt";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import DashboardIcon from "@material-ui/icons/Dashboard";
import InfoIcon from "@material-ui/icons/Info";
import ReceiptIcon from "@material-ui/icons/Receipt";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
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
    const theme = useTheme();
    const classes = useStyles();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(pageTitleSlice.actions.set("System"));
    }, [dispatch]);

    return (
        <>
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
                <ListItem button component={Link} to={`/system/software`}>
                    <ListItemIcon>
                        <SystemUpdateAltIcon />
                    </ListItemIcon>
                    <ListItemText primary="Software" secondary="View and install available software updates" />
                    <ListItemIcon className={classes.navIcon}>
                        <ChevronRightIcon />
                    </ListItemIcon>
                </ListItem>
                <ListItem button component={Link} to={`/system/system`}>
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
