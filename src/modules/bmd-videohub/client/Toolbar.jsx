import React from "react";
import ToolbarWrapper from "@core/ToolbarWrapper";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
// import ListItemIcon from "@material-ui/core/ListItemIcon";
// import ListItemText from "@material-ui/core/ListItemText";
import EditIcon from "@material-ui/icons/Edit";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import DoneIcon from "@material-ui/icons/Done";

export default function Toolbar(props) {
    const toolbarProps = { ...props };
    const location = useLocation();

    const editMode = location.pathname.indexOf("/edit") > -1;
    const buttons = () => (
        <>
            {editMode ? (
                <Button
                    component={Link}
                    to={`/panel/${props.panelId}`}
                    variant="outlined"
                    color="primary"
                    startIcon={<DoneIcon />}
                >
                    Done
                </Button>
            ) : (
                <Button
                    component={Link}
                    to={`/panel/${props.panelId}/edit`}
                    variant="outlined"
                    color="primary"
                    startIcon={<EditIcon />}
                >
                    Edit
                </Button>
            )}
        </>
    );

    const menuItems = () => null;

    toolbarProps["buttons"] = buttons();
    toolbarProps["menuItems"] = menuItems();
    toolbarProps["onClick"] = null;
    return <ToolbarWrapper {...toolbarProps} isClosed={false} />;
}
