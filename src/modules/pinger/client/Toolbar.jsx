import React from "react";
import BugToolbarWrapper from "@core/BugToolbarWrapper";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import MapIcon from "@mui/icons-material/Map";
import GridViewIcon from "@mui/icons-material/GridView";
import { Link } from "react-router-dom";
import { usePanelStatus } from "@hooks/PanelStatus";

export default function Toolbar({ panelId, ...props }) {
    let toolbarProps = { ...props };
    const panelStatus = usePanelStatus();
    const editMode = location.pathname.indexOf("/edit") > -1;
    const mapMode = location.pathname.indexOf("/map") > -1;

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

            {mapMode ? (
                <Button
                    component={Link}
                    to={`/panel/${panelId}`}
                    variant="outlined"
                    color="primary"
                    startIcon={<GridViewIcon />}
                >
                    Grid
                </Button>
            ) : (
                <Button
                    component={Link}
                    to={`/panel/${panelId}/map`}
                    variant="outlined"
                    color="primary"
                    startIcon={<MapIcon />}
                >
                    Map
                </Button>
            )}
        </>
    );

    toolbarProps["buttons"] = panelStatus.hasCritical ? null : buttons();
    toolbarProps["onClick"] = null;

    return <BugToolbarWrapper {...toolbarProps} />;
}
