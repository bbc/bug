import BugToolbarWrapper from "@core/BugToolbarWrapper";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { ListItemIcon, ListItemText, MenuItem } from "@mui/material";

export default function Toolbar({ panelId, ...props }) {
    let toolbarProps = { ...props };

    toolbarProps["onClick"] = null;

    const handleWebpageClicked = async (event) => {
        const url = `./../container/${panelId}/clock/large`;
        const newWindow = window.open(url, "_blank", "noopener,noreferrer");
        if (newWindow) newWindow.opener = null;
        event.stopPropagation();
        event.preventDefault();
    };

    const menuItems = () => [
        <MenuItem onClick={handleWebpageClicked} key="launch">
            <ListItemIcon>
                <OpenInNewIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Goto Webpage" />
        </MenuItem>,
    ];

    toolbarProps["buttons"] = null;
    toolbarProps["menuItems"] = menuItems();
    toolbarProps["onClick"] = null;

    return <BugToolbarWrapper {...toolbarProps} />;
}
