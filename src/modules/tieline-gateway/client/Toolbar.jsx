import BugToolbarWrapper from "@core/BugToolbarWrapper";
import { usePanelStatus } from "@hooks/PanelStatus";
import CheckIcon from "@mui/icons-material/Check";
import LaunchIcon from "@mui/icons-material/Launch";
import { Divider, ListItemIcon, ListItemText, MenuItem } from "@mui/material";
import AxiosPut from "@utils/AxiosPut";
import { useSelector } from "react-redux";

export default function Toolbar({ panelId, ...props }) {
    const toolbarProps = { ...props };
    const panelStatus = usePanelStatus();
    const panelConfig = useSelector((state) => state.panelConfig);

    if (!panelStatus) {
        return null;
    }

    const handleLaunchClicked = async (event, item) => {
        if (panelConfig?.data?.address) {
            const url = `http://${panelConfig.data.address}`;
            const newWindow = window.open(url, "_blank", "noopener,noreferrer");
            if (newWindow) newWindow.opener = null;
        }
    };

    const handleShowAdvancedClicked = async (event, item) => {
        await AxiosPut(`/api/panelconfig/${panelId}`, {
            showAdvanced: !panelConfig?.data?.showAdvanced,
        });
    };

    const buttons = () => {};

    const menuItems = () => {
        return [
            <Divider key="divider1" />,
            <MenuItem key="showadvanced" onClick={handleShowAdvancedClicked}>
                <ListItemIcon>{panelConfig?.data?.showAdvanced ? <CheckIcon fontSize="small" /> : null}</ListItemIcon>
                <ListItemText primary="Show Advanced" />
            </MenuItem>,
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
