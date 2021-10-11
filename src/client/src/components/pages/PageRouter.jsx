import React from "react";
import PageContent from "./PageContent";
import NavDesktop from "@components/NavDesktop";
import NavMobile from "@components/NavMobile";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";

const PageRouter = () => {
    const ShowMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));
    const ShowDesktop = useMediaQuery((theme) => theme.breakpoints.up("sm"));

    const NavSwitcher = (props) => {
        if (ShowDesktop) {
            return <NavDesktop>{props.children}</NavDesktop>;
        }
        if (ShowMobile) {
            return <NavMobile>{props.children}</NavMobile>;
        }
        return <>Nope</>;
    };

    return React.useMemo(
        () => (
            <Box
                sx={{
                    display: "flex",
                    height: "100%",
                }}
            >
                <NavSwitcher>
                    <PageContent />
                </NavSwitcher>
            </Box>
        ),
        [ShowMobile, ShowDesktop]
    );
};

export default PageRouter;
