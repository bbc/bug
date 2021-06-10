import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import RouterButton from "./RouterButton";

const useStyles = makeStyles((theme) => ({
    buttons: {
        padding: "0px 8px",
        marginBottom: 8,
        overflow: "auto",
        "@media (max-width:600px)": {
            padding: "0px 2px",
        },
    },
}));

export default function Router({ panelId, editMode = false, buttonType, buttons, selectedDestination, onClick }) {
    const classes = useStyles();

    return (
        <div className={classes.buttons}>
            {buttons.data[`${buttonType}s`].map((button) => (
                <RouterButton
                    key={button.index}
                    selected={buttonType === "source" ? button.selected : selectedDestination === button.index}
                    index={button.index}
                    primaryText={button.label}
                    secondaryText={buttonType === "source" ? "" : button.sourceLabel}
                    onClick={() => onClick(button.index)}
                    editMode={editMode}
                />
            ))}
        </div>
    );
}
