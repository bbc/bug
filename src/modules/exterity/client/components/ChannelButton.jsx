import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
export default function ChannelButton({ panelId }) {
    return (
        <>
            <Button
                component={Link}
                to={`/panel/${panelId}/channels/add`}
                variant="outlined"
                color="primary"
                startIcon={<FormatListNumberedIcon />}
            >
                Add Channel
            </Button>
        </>
    );
}
