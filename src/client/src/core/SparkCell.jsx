import React, { useContext, useState } from "react";
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
        width: "100%",
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

export default function SparkCell({ value, history }) {
    const classes = useStyles();

    if (!value) {
        return null;
    }

    if (history.every((item) => item.value === 0)) {
        return null;
    }

    // pull values from array of objects
    let values = history.map((a) => a.value);

    return (
        <>
            <div className={classes.sparkText}>{value !== "0" ? value : "0 b/s"}</div>
            <div className={classes.spark}>
                <Sparklines data={values}>
                    <SparklinesLine color="#337ab7" />
                </Sparklines>
            </div>
        </>
    );
}
