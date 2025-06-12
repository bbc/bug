import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import MoreIcon from "@mui/icons-material/MoreVert";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import React from "react";
import { Link } from "react-router-dom";

export default function PanelsToolbar(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleOpenMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <Button component={Link} to={`/panels/add`} variant="outlined" color="primary" startIcon={<AddIcon />}>
                    Add
                </Button>
                <Button
                    component={Link}
                    to={`/panels/edit`}
                    variant="outlined"
                    color="primary"
                    startIcon={<EditIcon />}
                >
                    Edit
                </Button>
            </Box>
            <IconButton
                sx={{
                    marginLeft: "0.5rem",
                    marginRight: "0.5rem",
                }}
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleOpenMenuClick}
            >
                <MoreIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose} onClick={handleClose}>
                <MenuItem component={Link} to={`/panels/add`}>
                    <ListItemIcon>
                        <AddIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Add Panel" />
                </MenuItem>
                <MenuItem component={Link} to={`/panels/edit`}>
                    <ListItemIcon>
                        <EditIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Edit" />
                </MenuItem>
            </Menu>
        </>
    );
}
