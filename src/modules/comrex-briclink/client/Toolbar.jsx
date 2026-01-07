import BugToolbarWrapper from "@core/BugToolbarWrapper";
import AddIcon from "@mui/icons-material/Add";
import LaunchIcon from "@mui/icons-material/Launch";
import { Button, Divider, ListItemIcon, ListItemText, MenuItem } from "@mui/material";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
export default function Toolbar({ panelId, ...props }) {
    const panelConfig = useSelector((state) => state.panelConfig);
    const location = useLocation();

    const isOnConnectionsPage = location.pathname.indexOf("connections") > -1;

    const handleLaunchClicked = async (event, item) => {
        if (panelConfig?.data?.address) {
            const url = `http://${panelConfig.data.address}`;
            const newWindow = window.open(url, "_blank", "noopener,noreferrer");
            if (newWindow) newWindow.opener = null;
        }
    };

    let toolbarProps = { ...props };

    const buttons = () => {
        if (isOnConnectionsPage) {
            return (
                <Button
                    component={Link}
                    to={`/panel/${panelId}/connection`}
                    variant="outlined"
                    color="primary"
                    startIcon={<AddIcon />}
                >
                    Add
                </Button>
            );
        }
        return null;
    };

    const menuItems = () => {
        return [
            <Divider key="divider1" />,
            isOnConnectionsPage && (
                <MenuItem key="add" component={Link} to={`/panel/${panelId}/connection`}>
                    <ListItemIcon>
                        <AddIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Add Connection" />
                </MenuItem>
            ),
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
