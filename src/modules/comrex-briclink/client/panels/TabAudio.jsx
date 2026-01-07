import { useApiPoller } from "@hooks/ApiPoller";
import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import AudioChain from "../components/AudioChain";
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
                <AudioChain levels={levels} type="input" history={history} />
                <Box
                    sx={{
                        borderTopWidth: "4px",
                        borderTopStyle: "solid",
                        borderTopColor: "border.light",
                    }}
                >
                    <AudioChain levels={levels} type="output" history={history} />
                </Box>
            </>
        );
    }
    return null;
}
