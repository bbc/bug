import EditIcon from "@mui/icons-material/Edit";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
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
