import React from "react";
import PageContent from "./PageContent";
import NavDesktop from "@components/NavDesktop";
import NavMobile from "@components/NavMobile";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";

const NavSwitcher = ({ showMobile, showDesktop, children }) => {
    if (showDesktop) {
        return <NavDesktop>{children}</NavDesktop>;
    }
    if (showMobile) {
        return <NavMobile>{children}</NavMobile>;
    }
    return <>Nope</>;
};

const PageRouter = () => {
    const showMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));
    const showDesktop = useMediaQuery((theme) => theme.breakpoints.up("sm"));

    return React.useMemo(
        () => (
            <Box
                sx={{
                    display: "flex",
                    height: "100%",
                }}
            >
                <NavSwitcher showMobile={showMobile} showDesktop={showDesktop}>
                    <PageContent />
                </NavSwitcher>
            </Box>
        ),
        [showMobile, showDesktop]
    );
};

export default PageRouter;
