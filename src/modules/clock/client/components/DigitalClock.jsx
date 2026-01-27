import { Box } from "@mui/material";
import { useEffect, useState } from "react";

const fontSizes = {
    xs: 40,
    sm: 60,
    md: 100,
    lg: 140,
    xl: 200,
};

export default function DigitalClock({ size = "md" }) {
    const [time, setTime] = useState("--:--:--");

    useEffect(() => {
        const getTime = () => {
            const now = new Date();
            setTime(
                now.toLocaleTimeString("en-GB", {
                    hour12: false,
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                })
            );
        };

        getTime();
        const interval = setInterval(getTime, 1000);
        return () => clearInterval(interval);
    }, []);

    const currentFontSize = fontSizes[size] || fontSizes.md;

    return (
        <Box
            sx={{
                color: "text.primary",
                fontFamily: "monospace",
                fontSize: `${currentFontSize}px`,
                lineHeight: 1,
            }}
        >
            {time}
        </Box>
    );
}
