import BugToolbarWrapper from "@core/BugToolbarWrapper";
import LaunchIcon from "@mui/icons-material/Launch";
import { ListItemIcon, ListItemText, MenuItem } from "@mui/material";
import { useSelector } from "react-redux";

export default function Toolbar({ panelId, ...props }) {
    const panelConfig = useSelector((state) => state.panelConfig);

    const handleLaunchClicked = async (event, item) => {
        if (panelConfig?.data?.address) {
            const url = `http://${panelConfig.data.address}`;
            const newWindow = window.open(url, "_blank", "noopener,noreferrer");
            if (newWindow) newWindow.opener = null;
        }
    };

    let toolbarProps = { ...props };

    const buttons = () => <></>;

    const menuItems = () => {
        return [
            <MenuItem key="launch" onClick={handleLaunchClicked}>
                <ListItemIcon>
                    <LaunchIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Launch device webpage" />
            </MenuItem>,
        ];
    };

    toolbarProps["buttons"] = buttons();
    toolbarProps["menuItems"] = menuItems();
    toolbarProps["onClick"] = null;
    return <BugToolbarWrapper {...toolbarProps} />;
}
