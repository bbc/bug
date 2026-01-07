import { Button } from "@mui/material";
export default function BugConfigFormDeleteButton({ sx = {}, ...props }) {
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
                    ...sx,
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
