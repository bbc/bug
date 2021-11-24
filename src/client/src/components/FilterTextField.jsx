import React from "react";
import TextField from "@mui/material/TextField";

export default function FilterTextField({ value, onChange }) {
    return (
        <TextField
            sx={{
                "& .MuiInputBase-root": {
                    borderRadius: 0,
                },
                "& .MuiInputBase-input": {
                    paddingTop: 10,
                    paddingBottom: 10,
                    fontSize: "0.875rem",
                },
            }}
            onChange={onChange}
            size="small"
            variant="standard"
            fullWidth
            value={value}
            type="text"
            placeholder="Filter ..."
        />
    );
}
