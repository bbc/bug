import ButtonMenu from "./ButtonMenu";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { useSortable } from "@dnd-kit/sortable";

const useStyles = makeStyles((theme) => ({
    editButton: {
        borderRadius: 5,
        margin: 4,
        width: 128,
        height: 128,
        padding: 0,
        textTransform: "none",
        lineHeight: 1.4,
        cursor: "move",
        "& .MuiButton-label": {
            flexDirection: "column",
            height: "100%",
        },
        "&:hover": {
            backgroundColor: "inherit",
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
        paddingLeft: 10,
    },
}));

export default function RouterButton({
    panelId,
    buttonType,
    button,
    icon = null,
    onClick,
    selected,
    editMode = false,
    onChange,
    groups,
}) {
    const classes = useStyles();
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: `${buttonType}:${button.index}`,
    });
    const indexPlusOne = (button.index + 1).toString();

    let transformString = "";

    if (transform?.x) {
        transformString += `translateX(${Math.round(transform?.x)}px)`;
    }
    if (transform?.y) {
        transformString += ` translateY(${Math.round(transform?.y)}px)`;
    }

    const style = {
        transform: transformString,
        transition,
    };

    const secondaryText = buttonType === "source" ? "" : button.sourceLabel;
    // console.log(button);
    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={
                editMode
                    ? clsx("MuiButtonBase-root", "MuiButton-root", "MuiButton-outlined", classes.editButton)
                    : clsx("MuiButtonBase-root", "MuiButton-root", "MuiButton-outlined", classes.button, {
                          [classes.buttonSelected]: selected,
                      })
            }
            variant="outlined"
            onClick={onClick}
        >
            <div className="MuiButton-label">
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
                        {button.label}
                    </div>
                    {editMode ? (
                        <ButtonMenu
                            panelId={panelId}
                            buttonType={buttonType}
                            button={button}
                            onChange={onChange}
                            groups={groups}
                        />
                    ) : null}
                </div>
            </div>
        </div>
    );
}
