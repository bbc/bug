import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Sparklines, SparklinesLine } from "react-sparklines";

const useStyles = makeStyles((theme) => ({
    spark: {
        "& svg": {
            height: 48,
            width: "100%",
        },
        position: "absolute",
        bottom: 8,
        // width: "100%",
        paddingRight: "0.5rem",
        height: 48,
    },
    sparkText: {
        position: "absolute",
        top: "1.375rem",
        zIndex: "1",
        textShadow: "0px 0px 5px #000",
    },
}));

export default function SparkCellGeneric({ units, historyKey, history }) {
    const classes = useStyles();

    if (!historyKey || !history) {
        return null;
    }

    if (!units) {
        units = "";
    }

    if (history.every((item) => item[historyKey] === 0)) {
        return null;
    }

    // pull values from array of objects
    const values = history.map((a) => a[historyKey]);

    const latestStat = () => {
        const latestStat = Math.round(history[0][historyKey] * 10) / 10;
        return latestStat;
    };

    return (
        <>
            <div className={classes.sparkText}>{latestStat() !== "0" ? `${latestStat()} ${units}` : `0 ${units}`}</div>
            <div className={classes.spark}>
                <Sparklines data={values}>
                    <SparklinesLine color="#337ab7" />
                </Sparklines>
            </div>
        </>
    );
}
