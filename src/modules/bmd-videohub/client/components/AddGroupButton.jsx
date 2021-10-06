import Button from "@mui/material/Button";
import { makeStyles } from "@mui/styles";
import AddIcon from "@mui/icons-material/Add";

const useStyles = makeStyles((theme) => ({
    button: {
        borderRadius: 3,
        margin: 4,
        width: 128,
        height: 48,
    },
}));

export default function AddGroupButton({ onClick }) {
    const classes = useStyles();
    return (
        <Button variant="outlined" color="secondary" className={classes.button} onClick={onClick}>
            <AddIcon />
        </Button>
    );
}
