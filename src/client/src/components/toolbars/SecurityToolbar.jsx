import React from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import EditIcon from "@material-ui/icons/Edit";

export default function SecurityToolbar(props) {
    return (
        <>
            <Button
                component={Link}
                to={`/system/security/edit`}
                variant="outlined"
                color="primary"
                startIcon={<EditIcon />}
                style={{ marginRight: 16 }}
            >
                Edit
            </Button>
        </>
    );
}
