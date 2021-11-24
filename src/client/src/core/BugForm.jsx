import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardActions from "@mui/material/CardActions";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useHotkeys } from "react-hotkeys-hook";

const BugForm = (props) => {
    useHotkeys("esc", props.onClose);

    return (
        <Card
            sx={{
                minWidth: 300,
                textAlign: "left",
                color: "text.secondary",
                position: "relative",
                maxWidth: "550px",
                margin: "auto",
            }}
        >
            {props.onClose && (
                <IconButton
                    aria-label="close"
                    sx={{
                        position: "absolute",
                        right: "0px",
                        top: "-2px",
                        color: "grey.A500",
                        padding: "15px",
                    }}
                    onClick={props.onClose}
                >
                    <CloseIcon />
                </IconButton>
            )}

            {props.children}
        </Card>
    );
};

const Header = (props) => {
    return (
        <CardHeader
            component={Paper}
            square
            elevation={1}
            sx={{
                padding: "15px",
            }}
            title={props.children}
        ></CardHeader>
    );
};

const Body = (props) => {
    return <CardContent>{props.children}</CardContent>;
};

const Actions = (props) => {
    return (
        <CardActions
            sx={{
                "& .MuiCardHeader-title": {
                    fontSize: "1rem",
                },
                padding: "16px",
                justifyContent: "flex-end",
            }}
        >
            {props.children}
        </CardActions>
    );
};

BugForm.Header = Header;
BugForm.Body = Body;
BugForm.Actions = Actions;
export default BugForm;
