import BugToolbarWrapper from "@core/BugToolbarWrapper";
import { usePanelStatus } from "@hooks/PanelStatus";
import { usePanelToolbarEventTrigger } from "@hooks/PanelToolbarEvent";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import { Button } from "@mui/material";

export default function Toolbar(props) {
    const toolbarProps = { ...props };
    const triggerPanelEvent = usePanelToolbarEventTrigger();
    const panelStatus = usePanelStatus();

    toolbarProps["onClick"] = null;

    const handleLocateClicked = async (event, item) => {
        triggerPanelEvent("locate");
    };

    const buttons = () => (
        <>
            <Button variant="outlined" color={"primary"} onClick={handleLocateClicked} startIcon={<GpsFixedIcon />}>
                Locate
            </Button>
        </>
    );

    const menuItems = () => {};
    toolbarProps["buttons"] = panelStatus.hasCritical ? null : buttons();
    toolbarProps["menuItems"] = panelStatus.hasCritical ? null : menuItems();
    return <BugToolbarWrapper {...toolbarProps} />;
}
