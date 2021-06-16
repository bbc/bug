import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles((theme) => ({
    button: {
        borderRadius: 3,
        margin: 4,
        width: 128,
        height: 48,
    },
}));

export default function GroupButton({ onClick }) {
    const classes = useStyles();
    return (
        <Button variant="outlined" className={classes.button} onClick={onClick}>
            <AddIcon />
        </Button>
    );
}
