import TerminalIcon from "@mui/icons-material/Terminal";
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
                <TerminalIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="View Logs" />
        </MenuItem>
    );
}
