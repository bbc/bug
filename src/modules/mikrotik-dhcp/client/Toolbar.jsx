import React from "react";
import ToolbarWrapper from "@core/ToolbarWrapper";
import Button from "@material-ui/core/Button";
import { usePanelStatus } from "@core/PanelStatusHook";
import FilterListIcon from "@material-ui/icons/FilterList";
import panelDataSlice from "@redux/panelDataSlice";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

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
            </>
        );
    };

    const menuItems = () => null;

    toolbarProps["buttons"] = panelStatus.hasCritical ? null : buttons();
    toolbarProps["menuItems"] = menuItems();
    toolbarProps["onClick"] = null;
    return <ToolbarWrapper {...toolbarProps} isClosed={false} />;
}
