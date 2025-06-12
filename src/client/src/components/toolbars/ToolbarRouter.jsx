import PageTitle from "@components/PageTitle";
import PanelsEditToolbar from "@components/toolbars/PanelsEditToolbar";
import PanelsToolbar from "@components/toolbars/PanelsToolbar";
import SecurityEditToolbar from "@components/toolbars/SecurityEditToolbar";
import SecurityToolbar from "@components/toolbars/SecurityToolbar";
import SystemToolbar from "@components/toolbars/SystemToolbar";
import UsersToolbar from "@components/toolbars/UsersToolbar";
import Box from "@mui/material/Box";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
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
        try {
            if (Toolbars["modules"][panelConfig?.data?.module]) {
                console.log("changed this comment in development to force a refresh of the Toolbar logic above");
                const Toolbar = Toolbars["modules"][panelConfig.data.module]["client"]["Toolbar"];
                return <Toolbar panelId={panelConfig.data.id} />;
            }
        } catch (error) {}

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
        case "/system":
            return (
                <>
                    <Title>
                        <PageTitle />
                    </Title>
                    <SystemToolbar />
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
