import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { useHotkeys } from "react-hotkeys-hook";

const useStyles = makeStyles((theme) => ({
    header: {
        padding: 15,
    },
    card: {
        minWidth: 300,
        textAlign: "left",
        color: theme.palette.text.secondary,
        position: "relative",
        maxWidth: 550,
        margin: "auto",
    },
    actions: {
        "& .MuiCardHeader-title": {
            fontSize: "1rem",
        },
        padding: 16,
        justifyContent: "flex-end",
    },
    closeButton: {
        position: "absolute",
        right: 0,
        top: -2,
        color: theme.palette.grey[500],
        padding: 15,
    },
    backButton: {
        position: "absolute",
        left: 0,
        top: 0,
        color: theme.palette.grey[500],
        padding: 15,
        "& .MuiSvgIcon-root": {
            marginLeft: 4,
            marginRight: -4,
        },
    },
}));

const BugForm = (props) => {
    const classes = useStyles();

    useHotkeys("esc", props.onClose);

    return (
        <Card className={classes.card}>
            {props.onClose && (
                <IconButton aria-label="close" className={classes.closeButton} onClick={props.onClose}>
                    <CloseIcon />
                </IconButton>
            )}

            {props.children}
        </Card>
    );
};

const Header = (props) => {
    const classes = useStyles();
    return (
        <CardHeader
            component={Paper}
            square
            elevation={1}
            className={classes.header}
            title={props.children}
        ></CardHeader>
    );
};

const Body = (props) => {
    return <CardContent>{props.children}</CardContent>;
};

const Actions = (props) => {
    const classes = useStyles();
    return <CardActions className={classes.actions}>{props.children}</CardActions>;
};

BugForm.Header = Header;
BugForm.Body = Body;
BugForm.Actions = Actions;
export default BugForm;