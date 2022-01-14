import React from "react";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";

export default function PanelEditTableGroupLabel({ value, onChanged, placeholder }) {
    return (
        <TableRow
            sx={{
                height: "48px",
                backgroundColor: "#212121",
            }}
        >
            <TableCell colSpan={7}>
                <TextField
                    sx={{
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        color: "primary.main",
                        "& .MuiInputBase-input": {
                            textTransform: "uppercase",
                            padding: "12px",
                        },
                    }}
                    fullWidth
                    style={{ width: "26rem" }}
                    value={value}
                    onChange={onChanged}
                    placeholder={placeholder}
                    type="text"
                    onClick={(event) => {
                        event.stopPropagation();
                    }}
                    variant="outlined"
                ></TextField>
            </TableCell>
        </TableRow>
    );
}
