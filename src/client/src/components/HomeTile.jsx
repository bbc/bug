import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    tile: {
    },
}));

export default function HomeTile() {
    const classes = useStyles();

    return (
        <div className={classes.tile}>
            tile....
        </div>
    );
}

