import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import Clock from "react-clock";
import "react-clock/dist/Clock.css";
const AnalogueClock = ({ size }) => {
    const [value, setValue] = useState(new Date());
    let width = 500;
    switch (size) {
        case "xl":
            width = 800;
            break;
        case "lg":
            width = 600;
            break;
        case "md":
            width = 384;
            break;
        case "sm":
            width = 225;
            break;
        case "xs":
            width = 190;
            break;
        default:
    }

    useEffect(() => {
        const interval = setInterval(() => setValue(new Date()), 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    const handWidths = {
        xs: 5,
        sm: 7,
        md: 10,
        lg: 13,
        xl: 16,
    };

    const secondHandWidths = {
        xs: 1,
        sm: 2,
        md: 3,
        lg: 4,
        xl: 5,
    };

    const dotWidths = {
        xs: 14,
        sm: 18,
        md: 24,
        lg: 36,
        xl: 42,
    };

    const marksLength = {
        xs: 2,
        sm: 3,
        md: 3,
        lg: 4,
        xl: 5,
    };

    const hourMarksWidth = {
        xs: 2,
        sm: 3,
        md: 6,
        lg: 10,
        xl: 16,
    };

    const minuteMarksWidth = {
        xs: 1,
        sm: 1,
        md: 2,
        lg: 2,
        xl: 3,
    };

    const numberFontSizes = {
        xs: "16px",
        sm: "20px",
        md: "40px",
        lg: "65px",
        xl: "90px",
    };

    const borderWidths = {
        xs: "6px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
    };

    return (
        <Box
            sx={{
                position: "relative",
                width: `${width}px`,
                "& .react-clock": {
                    width: "inherit !important",
                    paddingTop: "100%",
                },
                "& .react-clock__mark.react-clock__hour-mark .react-clock__mark__number": {
                    fontSize: numberFontSizes[size],
                },
                "& .react-clock__minute-hand__body": {
                    boxShadow: "0 0 16px 0 rgba(0, 0, 0, 0.5)",
                    borderRadius: "10px 10px 0 0",
                },
                "& .react-clock__hour-hand__body": {
                    boxShadow: "0 0 16px 0 rgba(0, 0, 0, 0.5)",
                    borderRadius: "10px 10px 0 0",
                },
                "& .react-clock__mark__number": {
                    fontSize: 90,
                    color: "#000000",
                    fontWeight: 400,
                    opacity: "0.8",
                    left: "-60px",
                    width: "120px",
                },
                "& .react-clock__second-hand__body": {
                    backgroundColor: "#d0211c",
                    borderRadius: "10px 20px 0 0",
                },
                "& .react-clock__face": {
                    borderColor: "#ccc",
                    backgroundColor: "#ccc",
                    borderWidth: `${borderWidths[size]} !important`,
                },
            }}
        >
            <Clock
                value={value}
                hourHandLength={60}
                hourHandOppositeLength={20}
                hourHandWidth={handWidths[size]}
                hourMarksLength={marksLength[size]}
                hourMarksWidth={hourMarksWidth[size]}
                minuteHandLength={97}
                minuteHandWidth={handWidths[size]}
                minuteHandOppositeLength={20}
                minuteMarksLength={marksLength[size]}
                minuteMarksWidth={minuteMarksWidth[size]}
                renderNumbers
                secondHandLength={70}
                secondHandOppositeLength={20}
                secondHandWidth={secondHandWidths[size]}
            />
            <Box
                component="span"
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",

                    width: dotWidths[size],
                    height: dotWidths[size],
                    marginTop: `${(dotWidths[size] / 2) * -1}px`,
                    marginLeft: `${(dotWidths[size] / 2) * -1}px`,

                    backgroundColor: "#d0211c",
                    borderRadius: "50%",
                    display: "inline-block",
                }}
            ></Box>
        </Box>
    );
};

export default AnalogueClock;
