import React from "react";
import { Link } from "react-router-dom";
import Grid from '@material-ui/core/Grid';
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
import { useSelector } from 'react-redux'

const Menu = (props) => {
    const panelList = useSelector(state => state.panelList);
    const enabledPanelList = panelList.data.filter((item) => item.enabled === true);

    const renderMenuItem = (item) => {
        if (!item.enabled) {
            return null;
        }
        return (
            <ListItem button component={Link} to={`/panel/${item.id}`} key={item.id}>
                <ListItemIcon>
                    <DynamicIcon iconName={item._module.icon} />
                </ListItemIcon>
                <ListItemText primary={item.title} />
            </ListItem>
        );
    };

    const renderMenuItems = (props) => {
        if (panelList.status === "loading") {
            return <Loading />;
        }
        if (panelList.status === "success") {
            return (
                <List aria-label="list of enabled modules">{panelList.data.map((panel) => renderMenuItem(panel))}</List>
            );
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
            style={{ height: '100%'}}
            >
            <Grid item style={{ width: '100%'}}>
                <List>
                    <ListItem button component={Link} to="/">
                        <ListItemIcon>
                            <HomeIcon />
                        </ListItemIcon>
                        <ListItemText primary="Home" />
                    </ListItem>
                </List>
                <Divider />
                {renderMenuItems(props)}
                {enabledPanelList.length > 0 ? <Divider /> : null}
                <List>
                    <ListItem button component={Link} to="/system">
                        <ListItemIcon>
                            <SettingsIcon />
                        </ListItemIcon>
                        <ListItemText primary="System" />
                    </ListItem>
                    <ListItem button component={Link} to="/panels">
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
