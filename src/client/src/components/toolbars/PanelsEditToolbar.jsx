import { usePanelToolbarEventTrigger } from "@hooks/PanelToolbarEvent";
import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";
import DoneIcon from "@mui/icons-material/Done";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
export default function PanelsToolbar() {
    const triggerPanelEvent = usePanelToolbarEventTrigger();

    const handleAddClicked = async (event, item) => {
        triggerPanelEvent("addGroup");
    };

    const handleSaveClicked = async (event, item) => {
        triggerPanelEvent("save");
    };

    return (
        <>
            <Button variant="outlined" color="primary" startIcon={<AddIcon />} onClick={handleAddClicked}>
                Add Group
            </Button>
            <Button variant="outlined" color="primary" startIcon={<DoneIcon />} onClick={handleSaveClicked}>
                Save
            </Button>
            <Button
                component={Link}
                to={`/panels`}
                variant="outlined"
                color="primary"
                startIcon={<CancelIcon />}
                style={{ marginRight: 16 }}
            >
                Cancel
            </Button>
        </>
    );
}
