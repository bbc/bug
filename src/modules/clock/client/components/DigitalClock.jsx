import { Box } from "@mui/material";
import { useEffect, useState } from "react";
export default function DigitalClock({ size }) {
    const [time, setTime] = useState("hh:mm:ss");

    useEffect(() => {
        getTime();
        const interval = setInterval(getTime, 500);
        return () => {
            clearInterval(interval);
        };
    }, []);

    const pad = (n, width, z) => {
        z = z || "0";
        n = n + "";
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    };

    const getTime = () => {
        const now = new Date();

        const hours = pad(now.getHours(), 2);
        const minutes = pad(now.getMinutes(), 2);
        const seconds = pad(now.getSeconds(), 2);

        setTime(hours + ":" + minutes + ":" + seconds);
    };

    const fontSizes = {
        xs: 40,
        sm: 60,
        md: 100,
        lg: 140,
        xl: 200,
    };

    return <Box sx={{ color: "text.primary", fontFamily: "monospace", fontSize: fontSizes[size] }}>{time}</Box>;
}
