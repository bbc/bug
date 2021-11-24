import React from "react";
import Box from "@mui/material/Box";

const BugHelperText = ({ children }) => {
    return (
        <Box
            sx={{
                color: "rgba(255, 255, 255, 0.7)",
                margin: "0",
                fontSize: "0.75rem",
                marginTop: "3px",
                textAlign: "left",
                fontFamily: "ReithSans",
                fontWeight: "400",
                lineHeight: "1.66",
            }}
        >
            {children}
        </Box>
    );
};
export default BugHelperText;
