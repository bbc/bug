import { TextField } from "@mui/material";

export default function FilterTextField({ value, onChange }) {
    return (
        <TextField
            sx={{
                "& .MuiInputBase-root": {
                    borderRadius: "0px",
                },
                "& .MuiInputBase-input": {
                    paddingTop: "10px",
                    paddingBottom: "10px",
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
