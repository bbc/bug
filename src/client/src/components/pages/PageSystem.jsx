import BugDynamicIcon from "@core/BugDynamicIcon";
import { faBug } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { styled, useTheme } from "@mui/material/styles";
import pageTitleSlice from "@redux/pageTitleSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const StyledList = styled(List)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    maxWidth: "550px",
    "& .MuiListItem-root": {
        borderBottom: `1px solid ${theme.palette.background.default}`,
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
        <BugDynamicIcon iconName="ChevronRight" />
    </ListItemIcon>
);

export default function PageSystem() {
    const dispatch = useDispatch();
    const theme = useTheme();

    useEffect(() => {
        dispatch(pageTitleSlice.actions.set("System"));
    }, [dispatch]);

    return (
        <>
            <StyledList>
                <ListItem button component={Link} to={`/system/about`}>
                    <ListItemIcon>
                        <FontAwesomeIcon color={theme.palette.text.primary} size="lg" icon={faBug} />
                    </ListItemIcon>
                    <ListItemText
                        primary="About BUG"
                        secondary="Links to documentation, help and more information about BUG"
                    />
                    <NavIcon />
                </ListItem>
                <ListItem button component={Link} to={`/system/info`}>
                    <ListItemIcon>
                        <BugDynamicIcon iconName={"Dvr"} />
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
                        <BugDynamicIcon iconName={"Settings"} />
                    </ListItemIcon>
                    <ListItemText primary="Global Configuration" secondary="Configure global settings and options" />
                    <NavIcon />
                </ListItem>
                <ListItem button component={Link} to={`/panels`}>
                    <ListItemIcon>
                        <BugDynamicIcon iconName={"Dashboard"} />
                    </ListItemIcon>
                    <ListItemText primary="Panels" secondary="Configure and maintain the panels on this BUG" />
                    <NavIcon />
                </ListItem>
            </StyledList>
            <StyledList>
                <ListItem button component={Link} to={`/system/users`}>
                    <ListItemIcon>
                        <BugDynamicIcon iconName={"People"} />
                    </ListItemIcon>
                    <ListItemText
                        primary="Users"
                        secondary="Manage usernames and passwords for access to this server"
                    />
                    <NavIcon />
                </ListItem>
                <ListItem button component={Link} to={`/system/security`}>
                    <ListItemIcon>
                        <BugDynamicIcon iconName={"Security"} />
                    </ListItemIcon>
                    <ListItemText primary="Security" secondary="Configure authentication methods and options" />
                    <NavIcon />
                </ListItem>
            </StyledList>
            <StyledList>
                <ListItem button component={Link} to={`/system/backup`}>
                    <ListItemIcon>
                        <BugDynamicIcon iconName={"SettingsBackupRestore"} />
                    </ListItemIcon>
                    <ListItemText
                        primary="Backup & Restore"
                        secondary="Download a complete backup or restore from file"
                    />
                    <NavIcon />
                </ListItem>
                <ListItem button component={Link} to={`/system/software`}>
                    <ListItemIcon>
                        <BugDynamicIcon iconName={"SystemUpdateAlt"} />
                    </ListItemIcon>
                    <ListItemText primary="Software" secondary="View and install available software updates" />
                    <NavIcon />
                </ListItem>
                <ListItem button component={Link} to={`/system/health`}>
                    <ListItemIcon>
                        <BugDynamicIcon iconName={"Info"} />
                    </ListItemIcon>
                    <ListItemText primary="System Health" secondary="CPU, RAM and disk information" />
                    <NavIcon />
                </ListItem>
                <ListItem button component={Link} to={`/system/logs`}>
                    <ListItemIcon>
                        <BugDynamicIcon iconName={"Receipt"} />
                    </ListItemIcon>
                    <ListItemText primary="Logs" secondary="View application and module logs" />
                    <NavIcon />
                </ListItem>
            </StyledList>
        </>
    );
}
