import CloseIcon from "@mui/icons-material/Close";
import { Box, IconButton } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import MpegEncoder from "../components/MpegEncoder";
import MpegEncoderStatus from "../components/MpegEncoderStatus";
export default function EncoderPanel({ panelId }) {
    const navigate = useNavigate();
    const params = useParams();

    const handleClose = () => {
        navigate(`/panel/${panelId}/display/mpegencoders`);
    };
    return (
        <>
            <Box>
                <IconButton
                    aria-label="close"
                    sx={{
                        position: "absolute",
                        right: "0px",
                        top: "0px",
                        color: "text.secondary",
                        padding: "16px",
                        zIndex: 1,
                    }}
                    onClick={handleClose}
                >
                    <CloseIcon />
                </IconButton>
            </Box>
            <Box
                sx={{
                    paddingRight: "58px",
                    paddingLeft: "58px",
                }}
            >
                <MpegEncoderStatus panelId={panelId} serviceId={params.serviceId} />
            </Box>
            <MpegEncoder panelId={panelId} serviceId={params.serviceId} />
        </>
    );
}
