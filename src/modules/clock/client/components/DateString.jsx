import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    dateText: {
        fontSize: 40,
        "@media (max-width:1280px)": {
            fontSize: 30,
        },
        "@media (max-width:960px)": {
            fontSize: 24,
        },
    },
}));

export default function DateString(props) {
    const classes = useStyles();
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

    return <div className={classes.dateText}>{dateString}</div>;
}
