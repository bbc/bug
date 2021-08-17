import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flexWrap: "wrap",
        "& > *": {
            margin: theme.spacing(0.5),
        },
    },
}));

export default function Chips({ options }) {
    const classes = useStyles();

    if (!options) {
        return null;
    }
    return (
        <div className={classes.root}>
            {options.map((option) => (
                <Chip key={option} label={option} />
            ))}
        </div>
    );
}
