import React from "react";
import { useParams, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { useHotkeys } from "react-hotkeys-hook";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import BugLoading from "@core/BugLoading";
import BugNoData from "@core/BugNoData";
import CloseIcon from "@mui/icons-material/Close";
import Iframe from "react-iframe";

export default function LinkPage() {
    const params = useParams();
    const panelConfig = useSelector((state) => state.panelConfig);
    const history = useHistory();

    const onClose = () => {
        history.goBack();
    };

    const link = panelConfig.data.links[params.linkIndex];

    if (panelConfig.status === "idle" || panelConfig.status === "loading") {
        return <BugLoading height="30vh" />;
    }

    if (!panelConfig.data.links[params.linkIndex]) {
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
                        backgroundColor: "appbar.default",
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
                        {link.title}
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
            </div>
            <Iframe url={link.url} frameBorder="0" width="100%" height="90%" id="link" position="relative" />
        </>
    );
}
