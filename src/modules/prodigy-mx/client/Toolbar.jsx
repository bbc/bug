import BugToolbarWrapper from "@core/BugToolbarWrapper";
import { usePanelStatus } from "@hooks/PanelStatus";
import CheckIcon from "@mui/icons-material/Check";
import DoneIcon from "@mui/icons-material/Done";
import EditIcon from "@mui/icons-material/Edit";
import { Button, Divider, ListItemIcon, ListItemText, MenuItem } from "@mui/material";
import AxiosPut from "@utils/AxiosPut";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
export default function Toolbar({ panelId, ...props }) {
    const toolbarProps = { ...props };
    const location = useLocation();
    const panelStatus = usePanelStatus();
    const panelConfig = useSelector((state) => state.panelConfig);
    const navigate = useNavigate();

    if (!panelStatus) {
        return null;
    }

    const editMode = location.pathname.indexOf("/edit") > -1;

    const handleUseTakeClicked = async (event, item) => {
        await AxiosPut(`/api/panelconfig/${panelId}`, {
            useTake: !panelConfig?.data?.useTake,
        });
    };

    const handleEditClicked = (event, item) => {
        const urlParts = location.pathname.split("/");
        if (urlParts.length === 3) {
            navigate(`/panel/${panelId}/edit`);
        } else if (urlParts.length === 5) {
            navigate(`/panel/${panelId}/edit/${urlParts.slice(-2).join("/")}`);
        } else if (urlParts.length === 7) {
            navigate(`/panel/${panelId}/edit/${urlParts.slice(-4).join("/")}`);
        }
    };

    const handleDoneClicked = (event, item) => {
        const urlParts = location.pathname.split("/");
        if (urlParts.length === 4) {
            navigate(`/panel/${panelId}/`);
        } else if (urlParts.length === 6) {
            navigate(`/panel/${panelId}/${urlParts.slice(-2).join("/")}`);
        } else if (urlParts.length === 8) {
            navigate(`/panel/${panelId}/${urlParts.slice(-4).join("/")}`);
        }
    };

    const getParams = (matchCount) => {
        const urlParts = location.pathname.split("/");
        if (urlParts.length === matchCount) {
            return urlParts.slice(-2).join("/");
        }
        return "";
    };

    const buttons = () => (
        <>
            {editMode ? (
                <Button variant="outlined" color="primary" startIcon={<DoneIcon />} onClick={handleDoneClicked}>
                    Done
                </Button>
            ) : (
                <Button variant="outlined" color="primary" startIcon={<EditIcon />} onClick={handleEditClicked}>
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
