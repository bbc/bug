import TextField from "@mui/material/TextField";

export default function BugReadonlyTextField(props) {
    return (
        <TextField
            variant="standard"
            InputProps={{ disableUnderline: true, readOnly: true }}
            sx={{
                "& .MuiInputLabel-formControl.Mui-focused": {
                    color: "rgba(255, 255, 255, 0.7)",
                },
                "& .MuiInputBase-input.MuiInput-input": {
                    cursor: "default",
                },
            }}
            {...props}
        />
    );
}
