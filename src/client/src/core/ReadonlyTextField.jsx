import TextField from "@mui/material/TextField";
import { makeStyles } from "@mui/styles";

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
