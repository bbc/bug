import BugToolbarWrapper from "@core/BugToolbarWrapper";
import { usePanelStatus } from "@hooks/PanelStatus";
import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/material";
import AxiosPost from "@utils/AxiosPost";
import { useAlert } from "@utils/Snackbar";
export default function Toolbar({ panelId, ...props }) {
    let toolbarProps = { ...props };
    const sendAlert = useAlert();
    const panelStatus = usePanelStatus();

    const handleAdd = async () => {
        if (await AxiosPost(`/container/${panelId}/notes`)) {
            sendAlert(`Added a new note`, {
                variant: "success",
            });
        } else {
            sendAlert(`Failed to add a new note`, { variant: "error" });
        }
    };

    const buttons = () => (
        <>
            <Button onClick={handleAdd} variant="outlined" color="primary" startIcon={<AddIcon />}>
                New Note
            </Button>
        </>
    );

    toolbarProps["buttons"] = panelStatus.hasCritical ? null : buttons();
    toolbarProps["onClick"] = null;

    return <BugToolbarWrapper {...toolbarProps} />;
}
