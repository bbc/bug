import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

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
        width: 128,
        height: 48,
        "&:hover": {
            backgroundColor: "none",
        },
    },
    editButtonSelected: {
        borderColor: "#33b77a",
    },
}));

export default function GroupButton({ selected = false, index, text, icon = null, onClick, editMode = false }) {
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
            {text}
        </Button>
    );
}
