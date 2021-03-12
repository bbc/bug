import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import InboxIcon from "@material-ui/icons/Inbox";
import DraftsIcon from "@material-ui/icons/Drafts";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBug } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom";
import { connect } from "react-redux";

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

function Menu(props) {
    const classes = useStyles();
    console.log(props);
    return (
        <div className={classes.root}>
            <Link to="/">
                <FontAwesomeIcon style={{ width: '100%'}} icon={faBug} className={classes.bugLogo}/>
            </Link>
            <List component="nav" aria-label="main mailbox folders">
                <ListItem button>
                    <ListItemIcon>
                        <InboxIcon />
                    </ListItemIcon>
                    <ListItemText primary="PW Matrix" />
                </ListItem>
                <ListItem button>
                    <ListItemIcon>
                        <DraftsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Comrex 1" />
                </ListItem>
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
