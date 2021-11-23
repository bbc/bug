import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MoreIcon from "@mui/icons-material/MoreVert";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Hidden } from "@material-ui/core";
import AddIcon from "@mui/icons-material/Add";

const useStyles = makeStyles(async (theme) => ({
    dropdownMenu: {
        marginLeft: "0.5rem",
        marginRight: "0.5rem",
    },
}));

export default function UsersToolbar(props) {
    const classes = useStyles();
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
            <Hidden xsDown>
                <Button component={Link} to={`/system/user`} variant="outlined" color="primary" startIcon={<AddIcon />}>
                    Add
                </Button>
            </Hidden>
            <IconButton
                className={classes.dropdownMenu}
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
