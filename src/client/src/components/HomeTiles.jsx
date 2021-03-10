import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import HomeTile from './HomeTile';

const useStyles = makeStyles((theme) => ({
    tilesContainer: {
    },
}));

export default function HomeTiles() {
    const classes = useStyles();

    return (
        <div className={classes.tilesContainer}>
            <HomeTile id="abc"></HomeTile>
            <HomeTile id="abc"></HomeTile>
        </div>
    );
}

