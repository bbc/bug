import React from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import DoneIcon from "@material-ui/icons/Done";
import CancelIcon from "@material-ui/icons/Cancel";

export default function PanelsToolbar(props) {
    return (
        <>
            <Button component={Link} to={`/panels`} variant="outlined" color="primary" startIcon={<DoneIcon />}>
                Save
            </Button>
            <Button
                component={Link}
                to={`/panels`}
                variant="outlined"
                color="primary"
                startIcon={<CancelIcon />}
                style={{ marginRight: 16 }}
            >
                Cancel
            </Button>
        </>
    );
}
