import SettingsIcon from "@mui/icons-material/Settings";
import { Alert, AlertTitle, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
export default function BugNoData({
    title = "No data found",
    message = "",
    panelId,
    showConfigButton = true,
    sx = {},
}) {
    const navigate = useNavigate();

    const handleConfig = (event) => {
        navigate(`/panel/${panelId}/config`);
    };

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                ...sx,
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
