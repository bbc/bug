import AddIcon from "@mui/icons-material/Add";
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

export default function UsersToolbar(props) {
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
                <Button component={Link} to={`/system/user`} variant="outlined" color="primary" startIcon={<AddIcon />}>
                    Add
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
                <MenuItem component={Link} to={`/system/user`}>
                    <ListItemIcon>
                        <AddIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Add User" />
                </MenuItem>
            </Menu>
        </>
    );
}
