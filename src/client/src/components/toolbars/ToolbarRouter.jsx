import React from "react";
import PageTitle from "@components/PageTitle";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import PanelsToolbar from "@components/toolbars/PanelsToolbar";
import PanelsEditToolbar from "@components/toolbars/PanelsEditToolbar";
import UsersToolbar from "@components/toolbars/UsersToolbar";
import SecurityToolbar from "@components/toolbars/SecurityToolbar";
import SecurityEditToolbar from "@components/toolbars/SecurityEditToolbar";
import Box from "@mui/material/Box";
import * as Toolbars from "../../../../modules/*/client/Toolbar.jsx";

const Title = ({ children }) => (
    <Box
        sx={{
            flexGrow: 1,
            overflow: "hidden",
        }}
    >
        {children}
    </Box>
);

const ToolbarRouter = (props) => {
    const location = useLocation();

    const panelConfig = useSelector((state) => state.panelConfig);
    if (panelConfig.status === "loading") {
        return null;
    }

    const renderPanelToolbar = () => {
        if (panelConfig.status !== "success") {
            return <></>;
        }

        if (Toolbars["modules"][panelConfig?.data?.module]) {
            console.log("change this comment line in development to force a refresh of the Toolbar logic above");
            const Toolbar = Toolbars["modules"][panelConfig.data.module]["client"]["Toolbar"];
            return <Toolbar panelId={panelConfig.data.id} />;
        }

        return <></>;
    };

    switch (location.pathname) {
        case "/panels":
            return (
                <>
                    <Title>
                        <PageTitle />
                    </Title>
                    <PanelsToolbar />
                </>
            );
        case "/panels/edit":
            return (
                <>
                    <Title>
                        <PageTitle />
                    </Title>
                    <PanelsEditToolbar />
                </>
            );
        case "/system/users":
            return (
                <>
                    <Title>
                        <PageTitle />
                    </Title>
                    <UsersToolbar />
                </>
            );
        case "/system/security":
            return (
                <>
                    <Title>
                        <PageTitle />
                    </Title>
                    <SecurityToolbar />
                </>
            );
        case "/system/security/edit":
            return (
                <>
                    <Title>
                        <PageTitle />
                    </Title>
                    <SecurityEditToolbar />
                </>
            );

        default:
            return (
                <>
                    <Title>
                        <PageTitle />
                    </Title>
                    {renderPanelToolbar()}
                </>
            );
    }
};

export default ToolbarRouter;
