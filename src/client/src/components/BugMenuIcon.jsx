import React, { useState } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import AxiosGet from "@utils/AxiosGet";
import useAsyncEffect from "use-async-effect";
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
    const [info, setInfo] = useState();

    useAsyncEffect(async () => {
        setInfo(await AxiosGet(`/api/system/info`));
    }, []);

    return (
        <ListItem button component={Link} to={`/system/about`}>
            <ListItemIcon className={classes.icon}>
                <FontAwesomeIcon size="lg" icon={faBug} />
            </ListItemIcon>
            <ListItemText
                primary="Bug"
                secondary={info?.version}
                secondaryTypographyProps={{ align: "right", display: "inline" }}
            />
        </ListItem>
    );
};

export default BugMenuIcon;
