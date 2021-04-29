import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";

const useStyles = makeStyles((theme) => ({
    header: {
        backgroundColor: theme.palette.appbar.default,
        color: theme.palette.primary.main,
        "& .MuiCardHeader-title": {
            fontSize: "0.875rem",
            fontWeight: 400,
            textTransform: "uppercase",
        },
        padding: 15
    },
    card: {
        minWidth: 300,
        textAlign: "left",
        color: theme.palette.text.secondary,
        position: "relative",
    },
    actions: {
        justifyContent: "flex-end",
        borderTopWidth: 1,
        borderTopColor: theme.palette.background.default,
        borderTopStyle: "solid",
        backgroundColor: theme.palette.appbar.default,
        "& .MuiCardHeader-title": {
            fontSize: "1rem",
            textTransform: "uppercase",
        },
        padding: "16px",
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

const PanelForm = (props) => {
    const classes = useStyles();
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
            elevation={4}
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

PanelForm.Header = Header;
PanelForm.Body = Body;
PanelForm.Actions = Actions;
export default PanelForm;
