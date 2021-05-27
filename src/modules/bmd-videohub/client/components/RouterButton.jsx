import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
    button: {
        backgroundColor: "#444",
        borderRadius: 5,
        margin: 4,
        "&:hover": {
            backgroundColor: "#0069d9",
        },
        width: 128,
        height: 128,
        padding: 0,
        textTransform: "none",
        lineHeight: 1.4,
        "& .MuiButton-label": {
            flexDirection: "column",
            height: "100%",
        },
        "@media (max-width:600px)": {
            height: 48,
        },
    },
    buttonSelected: {
        backgroundColor: "#337ab7",
        "&:hover": {
            backgroundColor: "#0069d9",
        },
    },
    buttonUpper: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "65%",
        "@media (max-width:600px)": {
            display: "none",
        },
    },
    secondaryText: {
        fontWeight: 500,
        fontSize: "0.7rem",
        opacity: 0.6,
    },
    buttonLower: {
        width: "100%",
        backgroundColor: "#333",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "35%",
        flexDirection: "column",
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        "@media (max-width:600px)": {
            backgroundColor: "inherit",
        },
    },
    circle: {
        border: "2px solid #3a3a3a",
        borderRadius: "100%",
        height: 64,
        width: 64,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    index: {
        color: "#303030",
        fontSize: 28,
        fontWeight: 300,
    },
    primaryText: {},
}));

export default function RouterButton({ selected = false, index, primaryText, secondaryText, icon = null, onClick }) {
    const classes = useStyles();
    const indexPlusOne = (index + 1).toString();
    return (
        <Button
            className={clsx(classes.button, {
                [classes.buttonSelected]: selected,
            })}
            onClick={onClick}
        >
            <div className={classes.buttonUpper}>
                <div className={classes.circle}>
                    <div className={classes.index}>{indexPlusOne}</div>
                </div>
            </div>
            <div className={classes.buttonLower}>
                <div className={classes.secondaryText}>{secondaryText}</div>
                <div className={classes.primaryText}>{primaryText}</div>
            </div>
        </Button>
    );
}
