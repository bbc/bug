import React from "react";
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
import DynamicIcon from "@utils/DynamicIcon";
import Loading from "@components/Loading";
import BugMenuIcon from "@components/BugMenuIcon";
import BadgeWrapper from "@components/BadgeWrapper";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { useLocation } from "react-router-dom";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

const useStyles = makeStyles((theme) => ({
    critical: {
        opacity: 0.5,
    },
    groupPanel: {
        padding: 0,
        display: "block",
    },
    group: {
        "&.MuiAccordion-root:before": {
            height: 0,
        },
        // boxShadow: "none",
        "&.Mui-expanded": {
            margin: 0,
        },
    },
    groupHeader: {
        // borderTop: "1px solid rgba(255, 255, 255, 0.12)",
        fontSize: "0.875rem",
        fontWeight: 500,
        textTransform: "uppercase",
        height: 48,
        "&.Mui-expanded": {
            // borderTop: "1px solid rgba(255, 255, 255, 0.12)",
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
}));

const Menu = ({ showGroups = true }) => {
    const classes = useStyles();
    const panelList = useSelector((state) => state.panelList);
    const panel = useSelector((state) => state.panel);
    const enabledPanelList = panelList.data.filter((item) => item.enabled === true);
    const location = useLocation();
    const [expanded, setExpanded] = React.useState(false);

    const renderMenuItem = (menuPanel) => {
        if (!menuPanel.enabled) {
            return null;
        }
        let hasCritical = menuPanel._status.filter((x) => x.type === "critical").length > 0;

        const isSelected = panel.status === "success" && menuPanel.id === panel.data.id;
        return (
            <ListItem
                className={hasCritical ? classes.critical : ""}
                button
                component={Link}
                to={`/panel/${menuPanel.id}`}
                key={menuPanel.id}
                selected={isSelected}
            >
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

    const GroupedMenuItems = ({ groupedItems }) => {
        return (
            <>
                {Object.entries(groupedItems).map(([eachGroup, index]) => {
                    return (
                        <Accordion
                            key={index}
                            elevation={0}
                            className={classes.group}
                            expanded={expanded === eachGroup}
                            onChange={handleAccordionChange(eachGroup)}
                        >
                            <AccordionSummary
                                className={classes.groupHeader}
                                expandIcon={expanded === eachGroup ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
                                onClick={(event) => {
                                    event.stopPropagation();
                                }}
                            >
                                {eachGroup}
                            </AccordionSummary>
                            <AccordionDetails className={classes.groupPanel}>
                                <List aria-label="list of enabled modules">
                                    {groupedItems[eachGroup].map((eachPanel) => renderMenuItem(eachPanel))}
                                </List>
                            </AccordionDetails>
                        </Accordion>
                    );
                })}
            </>
        );
    };

    const MenuItems = ({ items }) => {
        return <List aria-label="list of enabled modules">{items.map((eachPanel) => renderMenuItem(eachPanel))}</List>;
    };

    const renderPanelMenuItems = () => {
        if (panelList.status === "loading") {
            return <Loading />;
        }
        if (panelList.status === "success") {
            // sort the panels into groups
            let panelsByGroup = {};
            for (let eachPanel of panelList.data) {
                const group = eachPanel.group ? eachPanel.group : "other";
                if (!panelsByGroup[group]) {
                    panelsByGroup[group] = [];
                }
                panelsByGroup[group].push(eachPanel);
            }
            if (panelsByGroup.length === 1 || !showGroups) {
                return <MenuItems items={panelList.data} />;
            } else {
                return <GroupedMenuItems groupedItems={panelsByGroup} />;
            }
        } else {
            return null;
        }
    };

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
                    <List>
                        <ListItem button component={Link} to="/" selected={location.pathname === "/"}>
                            <ListItemIcon>
                                <HomeIcon />
                            </ListItemIcon>
                            <ListItemText primary="Home" />
                        </ListItem>
                    </List>
                    <Divider />
                    {renderPanelMenuItems()}
                    {enabledPanelList.length > 0 ? <Divider /> : null}
                    <List>
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
                </Grid>
                <Grid item>
                    <BugMenuIcon />
                </Grid>
            </Grid>
        </>
    );
};

export default Menu;
