import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import MoreIcon from "@material-ui/icons/MoreVert";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { Hidden } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles((theme) => ({
    dropdownMenu: {
        marginLeft: "-0.5rem",
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