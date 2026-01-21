import PageTitle from "@components/PageTitle";
import PanelsToolbar from "@components/toolbars/PanelsToolbar";
import SecurityEditToolbar from "@components/toolbars/SecurityEditToolbar";
import SecurityToolbar from "@components/toolbars/SecurityToolbar";
import SystemToolbar from "@components/toolbars/SystemToolbar";
import UsersToolbar from "@components/toolbars/UsersToolbar";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const rawModules = import.meta.glob("../../../../modules/*/client/Toolbar.jsx", { eager: true });

const Toolbars = { modules: {} };

Object.entries(rawModules).forEach(([path, module]) => {
    const pathParts = path.split("/");
    const moduleName = pathParts[pathParts.length - 3];

    if (!Toolbars.modules[moduleName]) {
        Toolbars.modules[moduleName] = { client: {} };
    }

    Toolbars.modules[moduleName].client.Toolbar = module.default || module.Toolbar;
});

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
                const Toolbar = Toolbars["modules"][panelConfig.data.module]["client"]["Toolbar"];
                return <Toolbar panelId={panelConfig.data.id} />;
            }
        } catch (error) {
            console.error("Toolbar resolution error:", error);
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
