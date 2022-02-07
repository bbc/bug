import React from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Button from "@mui/material/Button";
import SettingsIcon from "@mui/icons-material/Settings";
import { useHistory } from "react-router-dom";
import Box from "@mui/material/Box";

export default function BugNoData({ title = "No data found", message = "", panelId, showConfigButton = true }) {
    const history = useHistory();

    const handleConfig = (event) => {
        history.push(`/panel/${panelId}/config`);
    };

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
            }}
        >
            <Alert
                sx={{
                    minWidth: "20rem",
                    maxWidth: "50%",
                    margin: "1rem",
                    alignItems: "center",
                    "& .MuiAlert-message": {
                        display: "flex",
                        alignItems: "center",
                        "& .MuiTypography-root": {
                            marginBottom: 0,
                            marginTop: "1px",
                        },
                        flexGrow: 1,
                    },
                    "& .MuiAlert-icon": {
                        padding: "0px",
                    },
                }}
                severity="info"
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        flexGrow: 1,
                    }}
                >
                    <AlertTitle>{title}</AlertTitle>
                    <Box>{message}</Box>
                </Box>
                {showConfigButton && (
                    <Button
                        key="configure"
                        variant="outlined"
                        color="secondary"
                        disableElevation
                        onClick={handleConfig}
                        startIcon={<SettingsIcon />}
                        sx={{
                            marginLeft: "1rem",
                            color: "white",
                            borderColor: "white",
                        }}
                    >
                        Configure
                    </Button>
                )}
            </Alert>
        </Box>
    );
}
