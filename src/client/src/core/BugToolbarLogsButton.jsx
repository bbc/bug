import AssignmentIcon from "@mui/icons-material/Assignment";
import { ListItemIcon, ListItemText, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function BugToolbarLogsButton({ panelId }) {
    const navigate = useNavigate();

    const handleLogsClicked = (event, item) => {
        navigate(`/system/logs/${panelId}`);
    };

    return (
        <MenuItem key="launch" onClick={handleLogsClicked}>
            <ListItemIcon>
                <AssignmentIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="View Logs" />
        </MenuItem>
    );
}
