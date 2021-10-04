import React from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import DoneIcon from "@mui/icons-material/Done";
import CancelIcon from "@mui/icons-material/Cancel";

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
