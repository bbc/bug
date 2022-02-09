import React from "react";
import DigitalClock from "../components/DigitalClock";
import AnalogueClock from "../components/AnalogueClock";
import DateString from "../components/DateString";
import { useSelector } from "react-redux";
import Hidden from "@mui/material/Hidden";
import Box from "@mui/material/Box";

export default function MainPanel() {
    const panelConfig = useSelector((state) => state.panelConfig);

    const Clock = (props) => {
        if (panelConfig.data.type === "digital") {
            return <DigitalClock {...props} />;
        }
        return <AnalogueClock {...props} />;
    };

    const renderClock = () => {
        return (
            <>
                <Hidden only={["sm", "md", "lg", "xl"]}>
                    <Clock size="xs" />
                </Hidden>
                <Hidden only={["xs", "md", "lg", "xl"]}>
                    <Clock size="sm" />
                </Hidden>
                <Hidden only={["xs", "sm", "lg", "xl"]}>
                    <Clock size="md" />
                </Hidden>
                <Hidden only={["xs", "sm", "md", "xl"]}>
                    <Clock size="lg" />
                </Hidden>
                <Hidden only={["xs", "sm", "md", "lg"]}>
                    <Clock size="xl" />
                </Hidden>
            </>
        );
    };

    if (panelConfig.status === "loading") {
        return <BugLoading />;
    }

    if (panelConfig.status !== "success") {
        return null;
    }

    return (
        <Box
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-around",
                minWidth: "200px",
                padding: "8px",
                textAlign: "center",
                color: "text.secondary",
            }}
        >
            {renderClock()}
            <DateString />
        </Box>
    );
}
