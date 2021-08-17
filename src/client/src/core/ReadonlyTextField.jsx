import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    root: {
        "& .MuiInputLabel-formControl.Mui-focused": {
            color: "rgba(255, 255, 255, 0.7)",
        },
        "& .MuiInputBase-input.MuiInput-input": {
            cursor: "default",
        },
    },
}));

export default function ReadonlyTextField(props) {
    const classes = useStyles();
    return <TextField InputProps={{ disableUnderline: true, readOnly: true }} className={classes.root} {...props} />;
}
