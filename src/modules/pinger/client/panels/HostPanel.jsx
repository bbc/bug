import BugLoading from "@core/BugLoading";
import BugNoData from "@core/BugNoData";
import BugTimeChart from "@core/BugTimeChart";
import CloseIcon from "@mui/icons-material/Close";
import { Box, IconButton, Typography } from "@mui/material";
import { useHotkeys } from "react-hotkeys-hook";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
export default function HostPanel() {
    const { panelId, hostId } = useParams();
    const panelConfig = useSelector((state) => state.panelConfig);
    const navigate = useNavigate();

    const onClose = () => {
        navigate(`/panel/${panelId}`);
    };

    if (panelConfig.status === "idle" || panelConfig.status === "loading") {
        return <BugLoading height="30vh" />;
    }

    if (!panelConfig.data.hosts[hostId]) {
        return <BugNoData title="Link not Found" showConfigButton={false} />;
    }

    useHotkeys("esc", onClose);

    return (
        <>
            <div style={{ position: "relative" }}>
                <Box
                    sx={{
                        width: "100%",
                        position: "absolute",
                        backgroundColor: "menu.main",
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            position: "absolute",
                            left: "0px",
                            top: "0px",
                            color: "rgba(255, 255, 255, 0.7)",
                            padding: "16px",
                            zIndex: 1,
                        }}
                    >
                        {panelConfig.data.hosts[hostId].title} - {panelConfig.data.hosts[hostId].host}
                    </Typography>
                    <IconButton
                        aria-label="close"
                        sx={{
                            position: "absolute",
                            right: "0px",
                            top: "0px",
                            color: "rgba(255, 255, 255, 0.7)",
                            padding: "16px",
                            zIndex: 1,
                        }}
                        onClick={onClose}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Box
                    sx={{
                        height: 60,
                        position: "relative",
                        zIndex: -1,
                    }}
                    className={`tabSpacer`}
                />
                <BugTimeChart url={`/container/${panelId}/hosts/${hostId}`} />
            </div>
        </>
    );
}
