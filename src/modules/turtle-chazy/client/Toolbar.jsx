import BugToolbarWrapper from "@core/BugToolbarWrapper";
import { usePanelStatus } from "@hooks/PanelStatus";
import CheckIcon from "@mui/icons-material/Check";
import DoneIcon from "@mui/icons-material/Done";
import EditIcon from "@mui/icons-material/Edit";
import LaunchIcon from "@mui/icons-material/Launch";
import { Button, Divider, ListItemIcon, ListItemText, MenuItem } from "@mui/material";
import AxiosPut from "@utils/AxiosPut";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

export default function Toolbar({ panelId, ...props }) {
    const toolbarProps = { ...props };
    const location = useLocation();
    const panelStatus = usePanelStatus();
    const panelConfig = useSelector((state) => state.panelConfig);
    const navigate = useNavigate();

    if (!panelStatus) {
        return null;
    }

    const editMode = location.pathname.indexOf("/edit") > -1;

    const handleUseTakeClicked = async (event, item) => {
        await AxiosPut(`/api/panelconfig/${panelId}`, {
            useTake: !panelConfig?.data?.useTake,
        });
    };

    const handleEditClicked = (event, item) => {
        const urlParts = location.pathname.split("/");
        const routeIdx = urlParts.indexOf("route");
        const groups = routeIdx !== -1 ? urlParts.slice(routeIdx + 1).join("/") : "";
        navigate(`/panel/${panelId}/edit/${groups}`);
    };

    const handleDoneClicked = (event, item) => {
        const urlParts = location.pathname.split("/");
        const editIdx = urlParts.indexOf("edit");
        const groups = editIdx !== -1 ? urlParts.slice(editIdx + 1).join("/") : "";
        navigate(`/panel/${panelId}/route/${groups}`);
    };

    const handleLaunchClicked = async (event, item) => {
        if (panelConfig?.data?.address) {
            const url = `http://${panelConfig.data.address}`;
            const newWindow = window.open(url, "_blank", "noopener,noreferrer");
            if (newWindow) newWindow.opener = null;
        }
    };

    const buttons = () => (
        <>
            {editMode ? (
                <Button variant="outlined" color="primary" startIcon={<DoneIcon />} onClick={handleDoneClicked}>
                    Done
                </Button>
            ) : (
                <Button variant="outlined" color="primary" startIcon={<EditIcon />} onClick={handleEditClicked}>
                    Edit
                </Button>
            )}
        </>
    );

    const menuItems = () => {
        return [
            <Divider key="divider1" />,
            <MenuItem key="usetake" onClick={handleUseTakeClicked}>
                <ListItemIcon>{panelConfig?.data?.useTake ? <CheckIcon fontSize="small" /> : null}</ListItemIcon>
                <ListItemText primary="Confirm Take" />
            </MenuItem>,
            <Divider key="divider" />,
            <MenuItem key="launch" onClick={handleLaunchClicked}>
                <ListItemIcon>
                    <LaunchIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Launch device webpage" />
            </MenuItem>,
        ];
    };

    toolbarProps["buttons"] = panelStatus.hasCritical ? null : buttons();
    toolbarProps["menuItems"] = menuItems();
    toolbarProps["onClick"] = null;
    return <BugToolbarWrapper {...toolbarProps} />;
}
