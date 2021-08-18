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

    const menuItems = () => null;

    toolbarProps["buttons"] = buttons();
    toolbarProps["menuItems"] = menuItems();
    toolbarProps["onClick"] = null;
    return <ToolbarWrapper {...toolbarProps} isClosed={false} />;
}
