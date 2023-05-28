import React from "react";
import MpegEncoder from "../components/MpegEncoder";
import MpegEncoderStatus from "../components/MpegEncoderStatus";
import { useParams } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { useHistory } from "react-router-dom";

export default function EncoderPanel({ panelId }) {
    const history = useHistory();
    const params = useParams();

    const handleClose = () => {
        history.push(`/panel/${panelId}/display/mpegencoders`);
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
