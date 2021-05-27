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
        "& .MuiButton-label": {
            flexDirection: "column",
            height: "100%",
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
    },
    buttonLower: {
        width: "100%",
        backgroundColor: "#333",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "35%",
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
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

export default function RouterButton({ selected = false, index, text, icon = null, onClick }) {
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
                <div className={classes.primaryText}>{text}</div>
            </div>
        </Button>
    );
}
