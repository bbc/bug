import BadgeWrapper from "@components/BadgeWrapper";
import BugMenuIcon from "@components/BugMenuIcon";
import UserMenuItem from "@components/users/UserMenuItem";
import BugDynamicIcon from "@core/BugDynamicIcon";
import BugLoading from "@core/BugLoading";
import BugRestrictTo from "@core/BugRestrictTo";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import FaviconNotification from "@utils/FaviconNotification";
import panelListGroups, { defaultGroupText } from "@utils/panelListGroups";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

const faviconNotification = new FaviconNotification();

const MenuDivider = () => <Divider sx={{ backgroundColor: "background.default", margin: 0 }} />;

const Menu = ({ showGroups = true }) => {
    const panelList = useSelector((state) => state.panelList);
    const panel = useSelector((state) => state.panel);
    const user = useSelector((state) => state.user);
    const strategies = useSelector((state) => state.strategies);
    const settings = useSelector((state) => state.settings);
    const activePanelList = panelList.data.filter((item) => item._active);
    const location = useLocation();
    const [expanded, setExpanded] = React.useState(false);
    const enabledStrategiesCount = strategies.data.filter((eachStrategy) => eachStrategy.enabled).length;

    const getSelectedGroup = () => {
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

    const selectedGroup = getSelectedGroup();

    useEffect(() => {
        if (selectedGroup) {
            setExpanded(selectedGroup);
        }
    }, [selectedGroup]);

    const renderMenuItem = (menuPanel) => {
        if (!menuPanel.enabled) return null;

        const isSelected = panel.status === "success" && menuPanel.id === panel.data.id;

        return (
            <BugRestrictTo key={menuPanel.id} panel={menuPanel?.id}>
                <ListItemButton component={Link} to={`/panel/${menuPanel.id}`} selected={isSelected}>
                    <ListItemIcon sx={{ color: "inherit" }}>
                        <BadgeWrapper panel={menuPanel}>
                            <BugDynamicIcon iconName={menuPanel._module.icon} />
                        </BadgeWrapper>
                    </ListItemIcon>
                    <ListItemText primary={menuPanel.title} />
                </ListItemButton>
            </BugRestrictTo>
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
                        "&.MuiAccordion-root:before": { height: "0px" },
                        "&.Mui-expanded": { margin: "0px" },
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
                            "&.Mui-expanded": { minHeight: "48px", height: "48px" },
                            color: "primary.main",
                            "& .MuiAccordionSummary-content": { order: 2 },
                            "& .MuiButtonBase-root": { paddingLeft: 0, marginRight: 0 },
                            "& .MuiAccordionSummary-expandIcon.Mui-expanded": { transform: "none" },
                        }}
                        expandIcon={expanded === groupArrayItem.group ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
                    >
                        {groupArrayItem.group}
                    </AccordionSummary>
                    <AccordionDetails sx={{ padding: 0, display: "block" }}>
                        <List sx={{ padding: 0 }}>
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
        if (panelList.status === "loading") return <BugLoading />;
        if (panelList.status === "success") {
            if (roles.includes("user") || enabledStrategiesCount === 0) {
                const panelsByGroup = panelListGroups(
                    activePanelList,
                    true,
                    user?.data?.restrictPanels,
                    user?.data?.panels
                );
                return panelsByGroup.map((groups) => groupedMenuItems(groups));
            }
        }
        return null;
    };

    const setNotifications = (panels) => {
        const notificationCount = { info: 0, warning: 0, critical: 0, error: 0 };
        for (let panel of panels) {
            const criticalStatusCount = panel._status?.filter((x) => x.type === "critical").length || 0;
            if (criticalStatusCount > 0) {
                notificationCount.critical += 1;
            } else {
                for (let notification of panel._status || []) {
                    notificationCount[notification.type] += 1;
                }
            }
        }
        if (settings?.data?.title) {
            faviconNotification.setOptions({ title: settings.data.title });
        }
        faviconNotification.set(notificationCount);
    };

    setNotifications(activePanelList);

    return (
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
                            <ListItemButton
                                component={Link}
                                to="/"
                                selected={location.pathname === "/"}
                                onClick={() => setExpanded(false)}
                            >
                                <ListItemIcon sx={{ color: "inherit" }}>
                                    <BugDynamicIcon iconName="Home" />
                                </ListItemIcon>
                                <ListItemText primary="Home" />
                            </ListItemButton>
                        </List>
                        <MenuDivider />
                        {renderPanelMenuItems(user?.data?.roles, user?.data?.panels)}
                        {activePanelList.length > 0 ? <MenuDivider /> : null}

                        <BugRestrictTo role="admin">
                            <List disablePadding>
                                <ListItemButton
                                    component={Link}
                                    to="/system"
                                    selected={location.pathname.startsWith("/system")}
                                    onClick={() => setExpanded(false)}
                                >
                                    <ListItemIcon sx={{ color: "inherit" }}>
                                        <BugDynamicIcon iconName="Settings" />
                                    </ListItemIcon>
                                    <ListItemText primary="System" />
                                </ListItemButton>
                                <ListItemButton
                                    component={Link}
                                    to="/panels"
                                    selected={location.pathname.startsWith("/panels")}
                                    onClick={() => setExpanded(false)}
                                >
                                    <ListItemIcon sx={{ color: "inherit" }}>
                                        <BugDynamicIcon iconName="Dashboard" />
                                    </ListItemIcon>
                                    <ListItemText primary="Panels" />
                                </ListItemButton>
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
    );
};

export default Menu;
