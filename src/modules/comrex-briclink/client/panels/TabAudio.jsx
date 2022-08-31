import React from "react";
import AudioChain from "../components/AudioChain";
import { useParams } from "react-router-dom";
import { useApiPoller } from "@hooks/ApiPoller";
import Box from "@mui/material/Box";

export default function TabAudio() {
    const params = useParams();

    const levels = useApiPoller({
        url: `/container/${params.panelId}/audio/`,
        interval: 500,
    });

    const history = useApiPoller({
        url: `/container/${params.panelId}/audio/history`,
        interval: 2000,
    });

    if (levels.data && history.data) {
        return (
            <>
                <AudioChain levels={levels} type="output" history={history} />
                <Box sx={{ borderTop: "4px solid #181818" }}>
                    <AudioChain levels={levels} type="input" history={history} />
                </Box>
            </>
        );
    }
    return null;
}
