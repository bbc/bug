import React from "react";
import BugVolumeBar from "@core/BugVolumeBar";
import Box from "@mui/material/Box";

export default function BugAudioThumbnail({ src, leftLevel, rightLevel, min, max }) {
    return (
        <Box
            sx={{
                display: "flex",
                margin: "auto",
                "& .thumb-image": {
                    display: "block",
                    backgroundColor: "#1e1e1e",
                    height: 100,
                    width: 177,
                    "@media (max-width:1000px)": {
                        height: 90,
                        width: 160,
                    },
                    "@media (max-width:800px)": {
                        height: 72,
                        width: 128,
                    },
                },
            }}
        >
            <BugVolumeBar min={min} max={max} value={leftLevel} />
            {src ? <img src={src} className="thumb-image" /> : <Box className="thumb-image" />}
            <BugVolumeBar min={min} max={max} value={rightLevel} />
        </Box>
    );
}
