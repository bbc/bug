import CloseIcon from "@mui/icons-material/Close";
import { Box, Card, CardActions, CardContent, CardHeader, IconButton, Paper } from "@mui/material";
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

const Header = ({ children, sx = {} }) => {
    return (
        <CardHeader
            component={Paper}
            square
            elevation={0}
            sx={{
                padding: "16px",
                ...sx,
            }}
            title={children}
        ></CardHeader>
    );
};

const Body = ({ children, sx = {} }) => {
    return <CardContent sx={{ ...sx }}>{children}</CardContent>;
};

const Actions = ({ children, sx = {} }) => {
    return (
        <CardActions
            sx={{
                "& .MuiCardHeader-title": {
                    fontSize: "1rem",
                },
                padding: "16px",
                justifyContent: "flex-end",
                ...sx,
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
