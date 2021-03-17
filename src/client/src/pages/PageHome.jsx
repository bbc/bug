import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import HomeTitle from "../components/HomeTitle";
import HomeTiles from "../components//HomeTiles";

const useStyles = makeStyles({
    root: {},
});

export default function PageHome() {
    const classes = useStyles();

    return (
        <>
            <HomeTitle />
            <HomeTiles />
        </>
    );
}
