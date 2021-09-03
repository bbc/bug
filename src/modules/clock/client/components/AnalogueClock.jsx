import React, { useEffect, useState } from "react";
import Clock from "react-clock";
import "react-clock/dist/Clock.css";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    container: {
        position: "relative",
        width: 300,
        "& .react-clock": {
            width: "inherit !important",
            paddingTop: "100%",
        },
        "& .react-clock__face": {
            backgroundColor: "#ccc",
        },
    },
    xs: {
        "& .react-clock__mark.react-clock__hour-mark .react-clock__mark__number": {
            fontSize: 16,
        },
        "& .react-clock__face": {
            borderWidth: "6px !important",
        },
    },
    sm: {
        "& .react-clock__mark.react-clock__hour-mark .react-clock__mark__number": {
            fontSize: 20,
        },
        "& .react-clock__face": {
            borderWidth: "8px !important",
        },
    },
    md: {
        "& .react-clock__mark.react-clock__hour-mark .react-clock__mark__number": {
            fontSize: 40,
        },
        "& .react-clock__face": {
            borderWidth: "12px !important",
        },
    },
    lg: {
        "& .react-clock__mark.react-clock__hour-mark .react-clock__mark__number": {
            fontSize: 65,
        },
        "& .react-clock__face": {
            borderWidth: "16px !important",
        },
    },
    clock: {
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
            left: -60,
            width: 120,
        },
        "& .react-clock__second-hand__body": {
            backgroundColor: "#d0211c",
            borderRadius: 10,
            borderRadius: "10px 20px 0 0",
        },
        "& .react-clock__face": {
            borderColor: "#ccc",
            borderWidth: 20,
        },
    },
    dot: {
        position: "absolute",
        top: "50%",
        left: "50%",
        marginTop: -21,
        marginLeft: -21,
        height: 42,
        width: 42,
        backgroundColor: "#d0211c",
        borderRadius: "50%",
        display: "inline-block",
    },
}));

const AnalogueClock = ({ size }) => {
    const classes = useStyles();
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

    return (
        <div className={classes.container} style={{ width: width }}>
            <Clock
                className={`${classes.clock} ${classes[size]}`}
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
            <span
                className={classes.dot}
                style={{
                    width: dotWidths[size],
                    height: dotWidths[size],
                    marginTop: (dotWidths[size] / 2) * -1,
                    marginLeft: (dotWidths[size] / 2) * -1,
                }}
            ></span>
        </div>
    );
};

export default AnalogueClock;
