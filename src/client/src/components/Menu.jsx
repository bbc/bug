import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import HomeIcon from "@material-ui/icons/Home";
import SettingsIcon from "@material-ui/icons/Settings";
import DashboardIcon from "@material-ui/icons/Dashboard";
import DynamicIcon from "@core/DynamicIcon";
import Loading from "@components/Loading";
import BugMenuIcon from "@components/BugMenuIcon";
import UserMenuItem from "@components/users/UserMenuItem";
import BadgeWrapper from "@components/BadgeWrapper";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { useLocation } from "react-router-dom";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import _ from "lodash";
import panelListGroups, { defaultGroupText } from "@utils/panelListGroups";

const useStyles = makeStyles((theme) => ({
    list: {
        padding: 0,
    },
    groupPanel: {
        padding: 0,
        display: "block",
    },
    group: {
        "&.MuiAccordion-root:before": {
            height: 0,
        },
        "&.Mui-expanded": {
            margin: 0,
        },
    },
    groupHeader: {
        fontSize: "0.875rem",
        fontWeight: 500,
        textTransform: "uppercase",
        height: 48,
        "&.Mui-expanded": {
            minHeight: 48,
            height: 48,
        },
        color: theme.palette.primary.main,
        "& .MuiAccordionSummary-content": {
            order: 2,
        },
        "& .MuiButtonBase-root": {
            paddingLeft: 0,
            marginRight: 0,
        },
        "& .MuiAccordionSummary-expandIcon.Mui-expanded": {
            transform: "none",
        },
    },
    divider: {
        backgroundColor: "#181818",
        margin: 0,
    },
}));

const Menu = () => {
    const classes = useStyles();
    const panelList = useSelector((state) => state.panelList);
    const panel = useSelector((state) => state.panel);
    const user = useSelector((state) => state.user);
    const strategies = useSelector((state) => state.strategies);
    const enabledPanelList = panelList.data.filter((item) => item.enabled === true);
    const location = useLocation();
    const [expanded, setExpanded] = React.useState(false);
    const enabledStrategiesCount = strategies.data.filter((eachStrategy) => eachStrategy.enabled).length;

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
            <ListItem button component={Link} to={`/panel/${menuPanel.id}`} key={menuPanel.id} selected={isSelected}>
                <ListItemIcon>
                    <BadgeWrapper panel={menuPanel}>
                        <DynamicIcon iconName={menuPanel._module.icon} />
                    </BadgeWrapper>
                </ListItemIcon>
                <ListItemText primary={menuPanel.title} />
            </ListItem>
        );
    };

    const handleAccordionChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const groupedMenuItems = (group, panels) => {
        if (group) {
            return (
                <Accordion
                    key={group}
                    elevation={0}
                    className={classes.group}
                    expanded={expanded === group}
                    onChange={handleAccordionChange(group)}
                >
                    <AccordionSummary
                        className={classes.groupHeader}
                        expandIcon={expanded === group ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
                        onClick={(event) => {
                            event.stopPropagation();
                        }}
                    >
                        {group}
                    </AccordionSummary>
                    <AccordionDetails className={classes.groupPanel}>
                        <List className={classes.list}>{panels.map((eachPanel) => renderMenuItem(eachPanel))}</List>
                    </AccordionDetails>
                </Accordion>
            );
        } else {
            return (
                <List key="none" className={classes.list}>
                    {panels.map((eachPanel) => renderMenuItem(eachPanel))}
                </List>
            );
        }
    };

    const renderPanelMenuItems = () => {
        if (panelList.status === "loading") {
            return <Loading />;
        }
        if (panelList.status === "success") {
            const panelsByGroup = panelListGroups(panelList.data);
            const sortedGroupKeys = _.keys(panelsByGroup).sort((a, b) =>
                a.localeCompare(b, "en", { sensitivity: "base" })
            );
            return sortedGroupKeys.map((eachKey) => {
                return groupedMenuItems(
                    eachKey,
                    panelList.data.filter((panel) => panel.group === eachKey)
                );
            });
        } else {
            return null;
        }
    };

    //TODO move enabledStrategiesCount into redux user slice
    return (
        <>
            <Grid
                container
                direction="column"
                justify="space-between"
                alignItems="flex-start"
                style={{ height: "100%" }}
            >
                <Grid item style={{ width: "100%" }}>
                    {(user?.data || enabledStrategiesCount === 0) && (
                        <>
                            <List className={classes.list}>
                                <ListItem
                                    button
                                    component={Link}
                                    to="/"
                                    selected={location.pathname === "/"}
                                    onClick={() => {
                                        setExpanded(false);
                                    }}
                                >
                                    <ListItemIcon>
                                        <HomeIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Home" />
                                </ListItem>
                            </List>
                            <Divider className={classes.divider} />
                            {renderPanelMenuItems()}
                            {enabledPanelList.length > 0 ? <Divider className={classes.divider} /> : null}
                            <List className={classes.list}>
                                <ListItem
                                    button
                                    component={Link}
                                    to="/system"
                                    selected={location.pathname.startsWith("/system")}
                                    onClick={() => {
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
                                        setExpanded(false);
                                    }}
                                >
                                    <ListItemIcon>
                                        <DashboardIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Panels" />
                                </ListItem>
                            </List>
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
