import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBug } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import DynamicIcon from "../utils/DynamicIcon";
import Loading from "./Loading";
import { PanelContext } from "../data/PanelList";

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
        maxWidth: 300,
        minWidth: "200px",
        backgroundColor: theme.palette.menu.main,
    },

    bugLogo: {
        color: theme.palette.primary.main,
        height: "10rem",
        padding: "0.8rem",
        backgroundColor: "#181818",
    },
    menuItemIcon: {
        minWidth: "2.5rem",
        opacity: 0.5,
    },
}));

const Menu = (props) => {
    const classes = useStyles();

    const panelList = useContext(PanelContext);

    function ListItemLink(props) {
        return <ListItem button component="a" {...props} />;
    }

    const renderMenuItem = (item) => {
        if (!item.enabled) {
            return null;
        }
        if (!item.moduleInfo) {
            return null;
        }
        return (
            <ListItem button component={Link} to={`/panel/${item.id}`} key={item.id} className={classes.menuItem}>
                <ListItemIcon className={classes.menuItemIcon}>
                    <DynamicIcon iconName={item.moduleInfo.icon} />
                </ListItemIcon>
                <ListItemText primary={item.title} />
            </ListItem>
        );
    };

    const renderMenuItems = (props) => {
        // const panelList = props.panels.contents ?? [];
        if (panelList.status === "loading") {
            return <Loading />;
        }
        if (panelList.status === "succeeded") {
            return (
                <List component="nav" aria-label="list of enabled modules">
                    {panelList.data.map((panel) => renderMenuItem(panel))}
                </List>
            );
        } else {
            return null;
        }
    };

    return (
        <div className={classes.root}>
            <Link to="/">
                <FontAwesomeIcon style={{ width: "100%" }} icon={faBug} className={classes.bugLogo} />
            </Link>
            {renderMenuItems(props)}
            <Divider />
            <List component="nav" aria-label="secondary mailbox folders">
                <ListItem button>
                    <ListItemText primary="Settings" />
                </ListItem>
                <ListItemLink href="#simple-list">
                    <ListItemText primary="Help" />
                </ListItemLink>
            </List>
        </div>
    );
};

export default Menu;
