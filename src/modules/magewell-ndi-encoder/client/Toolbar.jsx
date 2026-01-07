import BugToolbarWrapper from "@core/BugToolbarWrapper";
import { usePanelStatus } from "@hooks/PanelStatus";
import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/material";
import { useState } from "react";
import AddDialog from "./components/AddDialog";
export default function Toolbar(props) {
    let toolbarProps = { ...props };
    const [dialogOpen, setDialogOpen] = useState(false);
    const panelStatus = usePanelStatus();
    toolbarProps["onClick"] = null;

    const handleAddClick = () => {
        setDialogOpen(true);
    };

    const buttons = () => (
        <>
            <Button onClick={handleAddClick} variant="outlined" color="primary" startIcon={<AddIcon />}>
                Add Encoder
            </Button>
            <AddDialog panelId={props?.panelId} open={dialogOpen} dialogOpen={setDialogOpen} />
        </>
    );

    const menuItems = () => [];

    toolbarProps["buttons"] = panelStatus.hasCritical ? null : buttons();
    toolbarProps["menuItems"] = panelStatus.hasCritical ? null : menuItems();

    return <BugToolbarWrapper {...toolbarProps} />;
}
