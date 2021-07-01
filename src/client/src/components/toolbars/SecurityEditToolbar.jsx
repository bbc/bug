import React from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import DoneIcon from "@material-ui/icons/Done";

export default function SecurityEditToolbar(props) {
    return (
        <>
            <Button
                component={Link}
                to={`/system/security`}
                variant="outlined"
                color="primary"
                startIcon={<DoneIcon />}
                style={{ marginRight: 16 }}
            >
                Done
            </Button>
        </>
    );
}
