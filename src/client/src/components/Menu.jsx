import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BugDynamicIcon from "@core/BugDynamicIcon";
import BugLoading from "@core/BugLoading";
import BugMenuIcon from "@components/BugMenuIcon";
import UserMenuItem from "@components/users/UserMenuItem";
import BadgeWrapper from "@components/BadgeWrapper";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import panelListGroups, { defaultGroupText } from "@utils/panelListGroups";
import FaviconNotification from "@utils/FaviconNotification";
import useSounds from "@hooks/Sounds";
import BugRestrictTo from "@core/BugRestrictTo";

const faviconNotification = new FaviconNotification();
let notificationsCount = 0;
let firstRun = true;

const Menu = ({ showGroups = true }) => {
    const panelList = useSelector((state) => state.panelList);
    const panel = useSelector((state) => state.panel);
    const user = useSelector((state) => state.user);
    const strategies = useSelector((state) => state.strategies);
    const enabledPanelList = panelList.data.filter((item) => item.enabled === true);
    const location = useLocation();
    const [expanded, setExpanded] = React.useState(false);
    const enabledStrategiesCount = strategies.data.filter((eachStrategy) => eachStrategy.enabled).length;

    const click = useSounds("/sounds/switch-off.mp3");
    const notification = useSounds("/sounds/notification.mp3");

    const getSelectedGroup = () => {
        // this is used to expand the groups when the page is loaded with a panel already open
        let selectedGroup = null;
        if (panelList.status === "success" && panelList.data && panel.status === "success" && panel.data) {
            for (let eachPanel of panelList.data) {
                if (eachPanel.id === panel.data.id) {
                    selectedGroup = eachPanel.group ? eachPanel.group : defaultGroupText;
                }
            }
        }
        return selectedGroup;
    };

    // we fetch this here so we can use it as a dependency in the useEffect
    const selectedGroup = getSelectedGroup();

    useEffect(() => {
        // only run this if the selectedGroup changes
        if (selectedGroup) {
            setExpanded(selectedGroup);
        }
    }, [selectedGroup]);

    const renderMenuItem = (menuPanel) => {
        if (!menuPanel.enabled) {
            return null;
        }
        const isSelected = panel.status === "success" && menuPanel.id === panel.data.id;
        return (
            <ListItem
                button
                component={Link}
                onClick={click}
                to={`/panel/${menuPanel.id}`}
                key={menuPanel.id}
                selected={isSelected}
            >
                <ListItemIcon>
                    <BadgeWrapper panel={menuPanel}>
                        <BugDynamicIcon iconName={menuPanel._module.icon} />
                    </BadgeWrapper>
                </ListItemIcon>
                <ListItemText primary={menuPanel.title} />
            </ListItem>
        );
    };

    const handleAccordionChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const groupedMenuItems = (groupArrayItem) => {
        if (groupArrayItem.group && showGroups) {
            return (
                <Accordion
                    key={groupArrayItem.group}
                    elevation={0}
                    sx={{
                        "&.MuiAccordion-root:before": {
                            height: "0px",
                        },
                        "&.Mui-expanded": {
                            margin: "0px",
                        },
                    }}
                    expanded={expanded === groupArrayItem.group}
                    onChange={handleAccordionChange(groupArrayItem.group)}
                >
                    <AccordionSummary
                        sx={{
                            fontSize: "0.875rem",
                            fontWeight: 500,
                            textTransform: "uppercase",
                            height: "48px",
                            "&.Mui-expanded": {
                                minHeight: "48px",
                                height: "48px",
                            },
                            color: "primary.main",
                            "& .MuiAccordionSummary-content": {
                                order: 2,
                            },
                            "& .MuiButtonBase-root": {
                                paddingLeft: "0px",
                                marginRight: "0px",
                            },
                            "& .MuiAccordionSummary-expandIcon.Mui-expanded": {
                                transform: "none",
                            },
                        }}
                        expandIcon={expanded === groupArrayItem.group ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
                        onClick={(event) => {
                            click();
                            event.stopPropagation();
                        }}
                    >
                        {groupArrayItem.group}
                    </AccordionSummary>
                    <AccordionDetails
                        sx={{
                            padding: "0px",
                            display: "block",
                        }}
                    >
                        <List
                            sx={{
                                padding: "0px",
                            }}
                        >
                            {groupArrayItem.items.map((eachPanel) => renderMenuItem(eachPanel))}
                        </List>
                    </AccordionDetails>
                </Accordion>
            );
        } else {
            return (
                <List key={`nogroup_${groupArrayItem.group}`} disablePadding>
                    {groupArrayItem.items.map((eachPanel) => renderMenuItem(eachPanel))}
                </List>
            );
        }
    };

    const renderPanelMenuItems = (roles = []) => {
        if (panelList.status === "loading") {
            return <BugLoading />;
        }
        if (panelList.status === "success") {
            if (roles.includes("user") || enabledStrategiesCount === 0) {
                const panelsByGroup = panelListGroups(panelList.data);
                return panelsByGroup.map((groups) => groupedMenuItems(groups));
            }
        } else {
            return null;
        }
    };

    const setNotifications = (panels) => {
        const notificationCount = {
            info: 0,
            warning: 0,
            critical: 0,
            error: 0,
        };

        for (let panel of panels) {
            const criticalStatusCount = panel._status && panel._status.filter((x) => x.type === "critical").length;

            // if we have any critical statuses for this panel, ignore any others
            if (criticalStatusCount > 0) {
                notificationCount["critical"] += 1;
            } else {
                // otherwise, count all the statuses
                for (let notification of panel._status) {
                    notificationCount[notification.type] += 1;
                }
            }
        }
        faviconNotification.set(notificationCount);
    };

    const MenuDivider = () => <Divider sx={{ backgroundColor: "#181818", margin: 0 }} />;

    const soundNotifications = (panels) => {
        const previousNotificationCount = notificationsCount;
        notificationsCount = 0;

        for (let panel of panels) {
            notificationsCount += panel._status.length;
        }

        if (!firstRun) {
            if (notificationsCount > previousNotificationCount) {
                notification();
            }
        } else {
            firstRun = false;
        }
    };

    soundNotifications(enabledPanelList);
    setNotifications(enabledPanelList);

    //TODO move enabledStrategiesCount into redux user slice
    return (
        <>
            <Grid
                container
                sx={{
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    height: "100%",
                }}
            >
                <Grid item style={{ width: "100%" }}>
                    {(user?.data || enabledStrategiesCount === 0) && (
                        <>
                            <List disablePadding>
                                <ListItem
                                    button
                                    component={Link}
                                    to="/"
                                    selected={location.pathname === "/"}
                                    onClick={() => {
                                        click();
                                        setExpanded(false);
                                    }}
                                >
                                    <ListItemIcon>
                                        <HomeIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Home" />
                                </ListItem>
                            </List>
                            <MenuDivider />
                            {renderPanelMenuItems(user?.data?.roles)}
                            {enabledPanelList.length > 0 ? <MenuDivider /> : null}

                            <BugRestrictTo role="admin">
                                <List disablePadding>
                                    <ListItem
                                        button
                                        component={Link}
                                        to="/system"
                                        selected={location.pathname.startsWith("/system")}
                                        onClick={() => {
                                            click();
                                            setExpanded(false);
                                        }}
                                    >
                                        <ListItemIcon>
                                            <SettingsIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="System" />
                                    </ListItem>
                                    <ListItem
                                        button
                                        component={Link}
                                        to="/panels"
                                        selected={location.pathname.startsWith("/panels")}
                                        onClick={() => {
                                            click();
                                            setExpanded(false);
                                        }}
                                    >
                                        <ListItemIcon>
                                            <DashboardIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Panels" />
                                    </ListItem>
                                </List>
                            </BugRestrictTo>
                        </>
                    )}
                </Grid>
                <Grid item style={{ width: "100%" }}>
                    <List>
                        <UserMenuItem />
                        <BugMenuIcon />
                    </List>
                </Grid>
            </Grid>
        </>
    );
};

export default Menu;
