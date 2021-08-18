import React from "react";
import ToolbarWrapper from "@core/ToolbarWrapper";
import Button from "@material-ui/core/Button";
import { usePanelStatus } from "@core/PanelStatusHook";
import FilterListIcon from "@material-ui/icons/FilterList";
import panelDataSlice from "@redux/panelDataSlice";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import AddIcon from "@material-ui/icons/Add";
import { Link } from "react-router-dom";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

export default function Toolbar(props) {
    const toolbarProps = { ...props };
    const panelStatus = usePanelStatus();
    const panelData = useSelector((state) => state.panelData);
    const dispatch = useDispatch();
    const location = useLocation();

    if (!panelStatus) {
        return null;
    }

    const filterEnabled = panelData && panelData.filter;
    console.log(panelData);
    const handleToggleFilter = () => {
        dispatch(
            panelDataSlice.actions.update({
                filter: !filterEnabled,
            })
        );
    };

    const buttons = () => {
        if (location.pathname.indexOf("lease") > -1) {
            return null;
        }

        if (panelStatus.hasCritical) {
            return null;
        }

        return (
            <>
                <Button
                    variant={filterEnabled ? "contained" : "outlined"}
                    color="primary"
                    startIcon={<FilterListIcon />}
                    onClick={handleToggleFilter}
                >
                    Filter
                </Button>
                <Button
                    component={Link}
                    to={`/panel/${props.panelId}/lease`}
                    variant="outlined"
                    color="primary"
                    startIcon={<AddIcon />}
                >
                    Add
                </Button>
            </>
        );
    };

    const menuItems = () => {
        return [
            <MenuItem key="filter" onClick={handleToggleFilter}>
                <ListItemIcon>
                    <FilterListIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={filterEnabled ? "Hide Filter" : "Show Filter"} />
            </MenuItem>,
            <MenuItem key="add" component={Link} to={`/panel/${props.panelId}/lease`}>
                <ListItemIcon>
                    <AddIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Add Lease" />
            </MenuItem>,
        ];
    };

    toolbarProps["buttons"] = buttons();
    toolbarProps["menuItems"] = menuItems();
    toolbarProps["onClick"] = null;
    return <ToolbarWrapper {...toolbarProps} isClosed={false} />;
}
