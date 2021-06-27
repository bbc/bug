import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBug } from "@fortawesome/free-solid-svg-icons";

const useStyles = makeStyles((theme) => ({
    icon: {
        padding: "2px",
    },
}));

const BugMenuIcon = (props) => {
    const classes = useStyles();
    return (
        <ListItem button component={Link} to={`/system`}>
            <ListItemIcon className={classes.icon}>
                <FontAwesomeIcon size="lg" icon={faBug} />
            </ListItemIcon>
            <ListItemText primary="Bug" />
        </ListItem>
    );
};

export default BugMenuIcon;
