import React from "react";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(async (theme) => ({
    title: {
        backgroundColor: theme.palette.menu.main,
        width: "100%",
        color: "#ffffff",
        fontSize: "2.5rem",
        padding: "0.5rem 1rem",
    },
}));

export default function HomeTitle() {
    const classes = useStyles();

    return <div className={classes.title}>Welcome to BUG</div>;
}
