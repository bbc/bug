import React from "react";
import Button from "@mui/material/Button";

export default function ConfigFormDeleteButton({ ...props }) {
    return (
        <Button
            variant="contained"
            sx={{
                backgroundColor: "error.main",
                color: "#fff",
                "&:hover": {
                    backgroundColor: "error.hover",
                },
            }}
            disableElevation
            {...props}
        >
            Delete
        </Button>
    );
}