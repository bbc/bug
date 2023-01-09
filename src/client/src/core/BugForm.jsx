import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardActions from "@mui/material/CardActions";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useHotkeys } from "react-hotkeys-hook";

const BugForm = ({ sx = {}, onClose, children, iconButtons = [] }) => {
    useHotkeys("esc", onClose);

    return (
        <Card
            sx={{
                minWidth: 300,
                textAlign: "left",
                color: "text.secondary",
                position: "relative",
                maxWidth: "550px",
                margin: "auto",
                ...sx,
            }}
        >
            <Box
                sx={{
                    marginRight: "8px",
                    height: "52px",
                    width: "100%",
                    position: "absolute",
                    display: "flex",
                    justifyContent: "flex-end",
                }}
            >
                {iconButtons}
                {onClose && (
                    <IconButton
                        aria-label="close"
                        sx={{
                            color: "grey.A500",
                            padding: "14px",
                        }}
                        onClick={onClose}
                    >
                        <CloseIcon />
                    </IconButton>
                )}
            </Box>

            {children}
        </Card>
    );
};

const Header = ({ children }) => {
    return (
        <CardHeader
            component={Paper}
            square
            elevation={1}
            sx={{
                padding: "16px",
            }}
            title={children}
        ></CardHeader>
    );
};

const Body = ({ children }) => {
    return <CardContent>{children}</CardContent>;
};

const Actions = ({ children }) => {
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
            {children}
        </CardActions>
    );
};

BugForm.Header = Header;
BugForm.Body = Body;
BugForm.Actions = Actions;
export default BugForm;
