import DoneIcon from "@mui/icons-material/Done";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
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
