import React from "react";
import PageContent from "./PageContent";
import NavDesktop from "@components/NavDesktop";
import NavMobile from "@components/NavMobile";
import Box from "@mui/material/Box";

const PageRouter = () => {
    return React.useMemo(
        () => (
            <Box
                sx={{
                    display: "flex",
                    height: "100%",
                }}
            >
                <NavDesktop>
                    <PageContent />
                </NavDesktop>
                <NavMobile>
                    <PageContent />
                </NavMobile>
            </Box>
        ),
        []
    );
};

export default PageRouter;
