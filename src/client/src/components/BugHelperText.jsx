import React from "react";
import Box from "@mui/material/Box";

const BugHelperText = ({ children }) => {
    return (
        <Box
            sx={{
                color: "text.primary",
                margin: "0",
                fontSize: "0.75rem",
                marginTop: "3px",
                textAlign: "left",
                fontFamily: "fontFamily",
                fontWeight: "400",
                lineHeight: "1.66",
            }}
        >
            {children}
        </Box>
    );
};
export default BugHelperText;
