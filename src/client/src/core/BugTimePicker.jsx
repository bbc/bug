import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

const StyledTextField = styled(TextField)({
    "& .MuiInputBase-input": {
        fontSize: "0.875rem",
        paddingTop: "9px",
    },
});

export default function BugTimePicker({ onChange, value, variant = "filled", sx = {}, ...props }) {
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <TimePicker
                ampm={false}
                value={value}
                onChange={onChange}
                slots={{
                    textField: StyledTextField,
                }}
                slotProps={{
                    textField: {
                        variant,
                        sx,
                    },
                }}
                {...props}
            />
        </LocalizationProvider>
    );
}
