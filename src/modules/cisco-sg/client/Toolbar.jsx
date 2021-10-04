import React from "react";
import { makeStyles } from "@mui/styles";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";

const useStyles = makeStyles((theme) => ({}));

export default function Toolbar(props) {
    const classes = useStyles();

    return (
        <>
            <IconButton aria-label="search" color="inherit">
                <SearchIcon />
            </IconButton>
            <IconButton aria-label="display more actions" edge="end" color="inherit">
                <MoreIcon />
            </IconButton>
        </>
    );
}
