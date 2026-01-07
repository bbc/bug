import { usePanelToolbarEvent } from "@hooks/PanelToolbarEvent";
import { Box } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function MainPanel({ panelId }) {
    const panelConfig = useSelector((state) => state.panelConfig);
    const [key, setKey] = useState(0);

    if (panelConfig.status === "loading") {
        return <BugLoading />;
    }

    if (panelConfig.status !== "success") {
        return null;
    }

    usePanelToolbarEvent("reload", () => {
        setKey((prevKey) => prevKey + 1);
    });

    return (
        <Box sx={{ height: "100%", width: "100%" }}>
            <iframe
                key={key}
                src={panelConfig.data.url}
                width="100%"
                height="100%"
                title="Embedded Content"
                style={{ border: "none", position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
                loading="lazy"
            />
        </Box>
    );
}
