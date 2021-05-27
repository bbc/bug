import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import MoreIcon from "@material-ui/icons/MoreVert";

const useStyles = makeStyles((theme) => ({
    editButton: {
        borderRadius: 5,
        margin: 4,
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
        textOverflow: "ellipsis",
        overflow: "hidden",
        whiteSpace: "nowrap",
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
    buttonLowerEdit: {
        flexDirection: "row",
        justifyContent: "space-between",
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
    primaryText: {
        textOverflow: "ellipsis",
        overflow: "hidden",
        whiteSpace: "nowrap",
    },
    primaryTextEdit: {
        paddingLeft: "1rem",
    },
}));

export default function RouterButton({
    selected = false,
    index,
    primaryText,
    secondaryText,
    icon = null,
    editMode = false,
}) {
    const classes = useStyles();
    const indexPlusOne = (index + 1).toString();
    return (
        <Button
            className={
                editMode
                    ? classes.editButton
                    : clsx(classes.button, {
                          [classes.buttonSelected]: selected,
                      })
            }
            variant="outlined"
        >
            <div className={classes.buttonUpper}>
                <div className={classes.circle}>
                    <div className={classes.index}>{indexPlusOne}</div>
                </div>
            </div>
            <div
                className={clsx(classes.buttonLower, {
                    [classes.buttonLowerEdit]: editMode,
                })}
            >
                {editMode ? null : <div className={classes.secondaryText}>{secondaryText}</div>}
                <div
                    className={clsx(classes.primaryText, {
                        [classes.primaryTextEdit]: editMode,
                    })}
                >
                    {primaryText}
                </div>
                {editMode ? <MoreIcon /> : null}
            </div>
        </Button>
    );
}
