import { Box } from "@mui/material";
import { useEffect, useState } from "react";
export default function DateString(props) {
    const [dateString, setDateString] = useState("DD/MM/YYYY");
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    useEffect(() => {
        getTime();
        const interval = setInterval(getTime, 500);
        return () => {
            clearInterval(interval);
        };
    }, []);

    const getTime = () => {
        const now = new Date();
        const day = days[now.getDay()];
        const month = months[now.getMonth()];
        const year = now.getFullYear();
        const date = now.getDate();
        setDateString(day + ", " + month + " " + date + ", " + year);
    };

    return (
        <Box
            sx={{
                color: "text.primary",
                fontSize: "40px",
                "@media (max-width:1280px)": {
                    fontSize: "30px",
                },
                "@media (max-width:960px)": {
                    fontSize: "24px",
                },
            }}
        >
            {dateString}
        </Box>
    );
}
