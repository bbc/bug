import BugToolbarWrapper from "@core/BugToolbarWrapper";
import { usePanelStatus } from "@hooks/PanelStatus";
import { usePanelToolbarEventTrigger } from "@hooks/PanelToolbarEvent";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import { Button, Divider, ListItemIcon, ListItemText, MenuItem } from "@mui/material";

export default function Toolbar({ panelId, ...props }) {
    const toolbarProps = { ...props };
    const panelStatus = usePanelStatus();
    const triggerPanelEvent = usePanelToolbarEventTrigger();

    if (!panelStatus) {
        return null;
    }

    const handleReloadClicked = async (event, item) => {
        triggerPanelEvent("reload");
    };

    const buttons = () => (
        <>
            <Button variant="outlined" color={"primary"} onClick={handleReloadClicked} startIcon={<RotateLeftIcon />}>
                Reload
            </Button>
        </>
    );

    const menuItems = () => {
        return [
            <Divider key="divider1" />,
            <MenuItem key="reload" onClick={handleReloadClicked}>
                <ListItemIcon>
                    <RotateLeftIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Reload" />
            </MenuItem>,
        ];
    };

    toolbarProps["buttons"] = panelStatus.hasCritical ? null : buttons();
    toolbarProps["menuItems"] = panelStatus.hasCritical ? null : menuItems();
    toolbarProps["onClick"] = null;
    return <BugToolbarWrapper {...toolbarProps} />;
}
