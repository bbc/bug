import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBug } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import DynamicIcon from '../utils/DynamicIcon';

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
        maxWidth: 300,
        minWidth: '200px',
        backgroundColor: theme.palette.menu.main
    },

    bugLogo: {
        color: theme.palette.primary.main,
        height: '10rem',
        padding: '0.8rem',
        backgroundColor: '#181818'
    }
}));

function mapStateToProps(state) {
    return { instances: state.instances };
};

function ListItemLink(props) {
    return <ListItem button component="a" {...props} />;
}

function renderItem(item) {
    if(!item.enabled) {
        return null;
    }
    if(!item.moduleInfo) {
        return null;
    }
    return (
        <ListItem button key={item.id}>
            <ListItemIcon>
                <DynamicIcon iconName={item.moduleInfo.icon} />
            </ListItemIcon>
            <ListItemText primary={item.title} />
        </ListItem>
    )
}

function Menu(props) {
    const instanceList = props.instances.contents ?? [];
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <Link to="/">
                <FontAwesomeIcon style={{ width: '100%'}} icon={faBug} className={classes.bugLogo}/>
            </Link>
            <List component="nav" aria-label="list of enabled modules">
                {instanceList.map((instance) => renderItem(instance))}
            </List>
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
}

export default connect(mapStateToProps)(Menu);
