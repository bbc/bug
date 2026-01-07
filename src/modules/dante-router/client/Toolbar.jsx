import BugToolbarWrapper from "@core/BugToolbarWrapper";
import { usePanelStatus } from "@hooks/PanelStatus";
import CheckIcon from "@mui/icons-material/Check";
import DoneIcon from "@mui/icons-material/Done";
import EditIcon from "@mui/icons-material/Edit";
import { Button, Divider, ListItemIcon, ListItemText, MenuItem } from "@mui/material";
import AxiosPut from "@utils/AxiosPut";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
export default function Toolbar({ panelId, ...props }) {
    const toolbarProps = { ...props };
    const location = useLocation();
    const panelStatus = usePanelStatus();
    const panelConfig = useSelector((state) => state.panelConfig);

    if (!panelStatus) {
        return null;
    }

    const editMode = location.pathname.indexOf("/edit") > -1;

    const handleUseTakeClicked = async (event, item) => {
        await AxiosPut(`/api/panelconfig/${panelId}`, {
            useTake: !panelConfig?.data?.useTake,
        });
    };

    const buttons = () => (
        <>
            {editMode ? (
                <Button
                    component={Link}
                    to={`/panel/${panelId}`}
                    variant="outlined"
                    color="primary"
                    startIcon={<DoneIcon />}
                >
                    Done
                </Button>
            ) : (
                <Button
                    component={Link}
                    to={`/panel/${panelId}/edit`}
                    variant="outlined"
                    color="primary"
                    startIcon={<EditIcon />}
                >
                    Edit
                </Button>
            )}
        </>
    );

    const menuItems = () => {
        return [
            <Divider key="divider1" />,
            <MenuItem key="usetake" onClick={handleUseTakeClicked}>
                <ListItemIcon>{panelConfig?.data?.useTake ? <CheckIcon fontSize="small" /> : null}</ListItemIcon>
                <ListItemText primary="Confirm Take" />
            </MenuItem>,
        ];
    };

    toolbarProps["buttons"] = panelStatus.hasCritical ? null : buttons();
    toolbarProps["menuItems"] = menuItems();
    toolbarProps["onClick"] = null;
    return <BugToolbarWrapper {...toolbarProps} />;
}
