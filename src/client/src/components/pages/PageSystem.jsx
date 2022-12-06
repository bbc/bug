import React, { useEffect } from "react";
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
import DvrIcon from "@mui/icons-material/Dvr";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBug } from "@fortawesome/free-solid-svg-icons";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";
import { styled } from "@mui/material/styles";

const StyledList = styled(List)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    maxWidth: "550px",
    "& .MuiListItem-root": {
        borderBottom: "1px solid #121212",
    },
    padding: "0px",
    margin: "8px auto",
}));

const NavIcon = () => (
    <ListItemIcon
        sx={{
            minWidth: "auto",
        }}
    >
        <ChevronRightIcon />
    </ListItemIcon>
);

export default function PageSystem() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(pageTitleSlice.actions.set("System"));
    }, [dispatch]);

    return (
        <>
            <StyledList>
                <ListItem button component={Link} to={`/system/about`}>
                    <ListItemIcon>
                        <FontAwesomeIcon size="lg" icon={faBug} />
                    </ListItemIcon>
                    <ListItemText
                        primary="About BUG"
                        secondary="Links to documentation, help and more information about BUG"
                    />
                    <NavIcon />
                </ListItem>
                <ListItem button component={Link} to={`/system/info`}>
                    <ListItemIcon>
                        <DvrIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary="System Information"
                        secondary="Application details, versions and information"
                    />
                    <NavIcon />
                </ListItem>
            </StyledList>
            <StyledList>
                <ListItem button component={Link} to={`/system/configuration`}>
                    <ListItemIcon>
                        <SettingsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Global Configuration" secondary="Configure global settings and options" />
                    <NavIcon />
                </ListItem>
                <ListItem button component={Link} to={`/panels`}>
                    <ListItemIcon>
                        <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Panels" secondary="Configure and maintain the panels on this BUG" />
                    <NavIcon />
                </ListItem>
            </StyledList>
            <StyledList>
                <ListItem button component={Link} to={`/system/users`}>
                    <ListItemIcon>
                        <PeopleIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary="Users"
                        secondary="Manage usernames and passwords for access to this server"
                    />
                    <NavIcon />
                </ListItem>
                <ListItem button component={Link} to={`/system/security`}>
                    <ListItemIcon>
                        <SecurityIcon />
                    </ListItemIcon>
                    <ListItemText primary="Security" secondary="Configure authentication methods and options" />
                    <NavIcon />
                </ListItem>
            </StyledList>
            <StyledList>
                <ListItem button component={Link} to={`/system/backup`}>
                    <ListItemIcon>
                        <SettingsBackupRestoreIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary="Backup & Restore"
                        secondary="Download a complete backup or restore from file"
                    />
                    <NavIcon />
                </ListItem>
                <ListItem button component={Link} to={`/system/software`}>
                    <ListItemIcon>
                        <SystemUpdateAltIcon />
                    </ListItemIcon>
                    <ListItemText primary="Software" secondary="View and install available software updates" />
                    <NavIcon />
                </ListItem>
                <ListItem button component={Link} to={`/system/health`}>
                    <ListItemIcon>
                        <InfoIcon />
                    </ListItemIcon>
                    <ListItemText primary="System Health" secondary="CPU, RAM and disk information" />
                    <NavIcon />
                </ListItem>
                <ListItem button component={Link} to={`/system/logs`}>
                    <ListItemIcon>
                        <ReceiptIcon />
                    </ListItemIcon>
                    <ListItemText primary="Logs" secondary="View application and module logs" />
                    <NavIcon />
                </ListItem>
            </StyledList>
        </>
    );
}
