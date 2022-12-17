import React from "react";
import Button from "@mui/material/Button";

export default function BugConfigFormDeleteButton({ ...props }) {
    return (
        <>
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
            <div style={{ flexGrow: 1 }}></div>
        </>
    );
}
