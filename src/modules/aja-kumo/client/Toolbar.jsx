import BugToolbarWrapper from "@core/BugToolbarWrapper";
import { usePanelStatus } from "@hooks/PanelStatus";
import DoneIcon from "@mui/icons-material/Done";
import EditIcon from "@mui/icons-material/Edit";
import { Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

export default function Toolbar({ panelId, ...props }) {
    const location = useLocation();
    const navigate = useNavigate();
    const panelStatus = usePanelStatus();
    if (!panelStatus) return null;

    const editMode = location.pathname.endsWith("/edit");
    const buttons = (
        <Button
            variant="outlined"
            color="primary"
            startIcon={editMode ? <DoneIcon /> : <EditIcon />}
            onClick={() => navigate(editMode ? `/panel/${panelId}` : `/panel/${panelId}/edit`)}
        >
            {editMode ? "Done" : "Edit"}
        </Button>
    );

    return <BugToolbarWrapper {...props} buttons={panelStatus.hasCritical ? null : buttons} />;
}
