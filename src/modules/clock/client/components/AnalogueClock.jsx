import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import Clock from "react-clock";
import "react-clock/dist/Clock.css";

const clockConfig = {
    width: { xs: 190, sm: 225, md: 384, lg: 600, xl: 800 },
    handWidth: { xs: 5, sm: 7, md: 10, lg: 13, xl: 16 },
    secondHandWidth: { xs: 1, sm: 2, md: 3, lg: 4, xl: 5 },
    dotWidth: { xs: 14, sm: 18, md: 24, lg: 36, xl: 42 },
    markLength: { xs: 2, sm: 3, md: 3, lg: 4, xl: 5 },
    hourMarkWidth: { xs: 2, sm: 3, md: 6, lg: 10, xl: 16 },
    minuteMarkWidth: { xs: 1, sm: 1, md: 2, lg: 2, xl: 3 },
    fontSize: { xs: "16px", sm: "20px", md: "40px", lg: "65px", xl: "90px" },
    borderWidth: { xs: "6px", sm: "8px", md: "12px", lg: "16px", xl: "20px" },
};

const AnalogueClock = ({ size = "md" }) => {
    const [value, setValue] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => setValue(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    const getVal = (property) => clockConfig[property][size] || clockConfig[property]["md"];

    const width = getVal("width");
    const dotWidth = getVal("dotWidth");

    return (
        <Box
            sx={{
                position: "relative",
                width: `${width}px`,
                height: `${width}px`,
                "& .react-clock": {
                    width: "100% !important",
                    height: "100% !important",
                },
                "& .react-clock__mark__number": {
                    fontSize: getVal("fontSize"),
                    color: "#000000",
                    fontWeight: 400,
                    opacity: "0.8",
                    left: "-60px",
                    width: "120px",
                },
                "& .react-clock__face": {
                    borderColor: "#ccc",
                    backgroundColor: "#ccc",
                    borderWidth: `${getVal("borderWidth")} !important`,
                },
            }}
        >
            <Clock
                value={value}
                hourHandWidth={getVal("handWidth")}
                hourMarksLength={getVal("markLength")}
                hourMarksWidth={getVal("hourMarkWidth")}
                minuteHandWidth={getVal("handWidth")}
                minuteMarksLength={getVal("markLength")}
                minuteMarksWidth={getVal("minuteMarkWidth")}
                secondHandWidth={getVal("secondHandWidth")}
                renderNumbers
                hourHandLength={60}
                hourHandOppositeLength={20}
                minuteHandLength={97}
                minuteHandOppositeLength={20}
                secondHandLength={70}
                secondHandOppositeLength={20}
            />
            <Box
                component="span"
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: dotWidth,
                    height: dotWidth,
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "#d0211c",
                    borderRadius: "50%",
                    display: "inline-block",
                    zIndex: 10,
                }}
            />
        </Box>
    );
};

export default AnalogueClock;
