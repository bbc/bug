import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import MoreIcon from "@material-ui/icons/MoreVert";
import GroupMenu from "./GroupMenu";

const useStyles = makeStyles((theme) => ({
    button: {
        backgroundColor: "#5c877c",
        borderRadius: 5,
        margin: 4,
        "&:hover": {
            backgroundColor: "#1d945d",
        },
        width: 128,
        height: 48,
    },
    buttonSelected: {
        backgroundColor: "#33b77a",
        "&:hover": {
            backgroundColor: "#1d945d",
        },
    },
    editButton: {
        borderRadius: 5,
        margin: 4,
        padding: 0,
        width: 128,
        height: 48,
        flexDirection: "row",
        justifyContent: "space-between",
        "&:hover": {
            backgroundColor: "none",
        },
    },
    editButtonSelected: {
        borderColor: "#33b77a",
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

export default function GroupButton({
    panelId,
    selected = false,
    index,
    primaryText,
    icon = null,
    onClick,
    editMode = false,
}) {
    const classes = useStyles();
    return (
        <Button
            className={
                editMode
                    ? clsx(classes.editButton, {
                          [classes.editButtonSelected]: selected,
                      })
                    : clsx(classes.button, {
                          [classes.buttonSelected]: selected,
                      })
            }
            onClick={onClick}
            variant="outlined"
        >
            <div
                className={clsx(classes.primaryText, {
                    [classes.primaryTextEdit]: editMode,
                })}
            >
                {primaryText}
            </div>
            {editMode ? <GroupMenu panelId={panelId} groupName={primaryText} groupIndex={index} /> : null}
        </Button>
    );
}
