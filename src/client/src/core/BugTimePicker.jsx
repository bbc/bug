import * as React from "react";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import TimePicker from "@mui/lab/TimePicker";
import { styled } from "@mui/material/styles";

const StyledTextField = styled(TextField)({
    "& .MuiInputBase-input.MuiFilledInput-input": {
        fontSize: "0.875rem",
        paddingTop: "9px",
    },
});

export default function BugTimePicker({ value, onChange, ...props }) {
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <TimePicker
                sx={{}}
                ampm={false}
                value={value}
                onChange={onChange}
                renderInput={(params) => <StyledTextField {...params} variant="filled" />}
                {...props}
            />
        </LocalizationProvider>
    );
}
