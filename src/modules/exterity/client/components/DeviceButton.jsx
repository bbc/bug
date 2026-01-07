import TvIcon from "@mui/icons-material/Tv";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
export default function DeviceButton({ panelId }) {
    return (
        <>
            <Button
                component={Link}
                to={`/panel/${panelId}/devices/add`}
                variant="outlined"
                color="primary"
                startIcon={<TvIcon />}
            >
                Add Device
            </Button>
        </>
    );
}
