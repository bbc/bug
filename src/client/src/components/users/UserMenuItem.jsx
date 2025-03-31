import BugAvatar from "@core/BugAvatar";
import EditIcon from "@mui/icons-material/Edit";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import userSlice from "@redux/userSlice";
import AxiosPost from "@utils/AxiosPost";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

const UserMenuItem = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const [anchorEl, setAnchorEl] = useState(null);
    const history = useHistory();
    const open = Boolean(anchorEl);

    const handleOpenMenuClick = (event) => {
        if (user?.status === "success") {
            setAnchorEl(event.currentTarget);
        } else {
            history.push("/login");
        }
        event.stopPropagation();
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleEdit = (event) => {
        history.push(`/system/user/${user?.data?.id}`);
        handleClose();
        event.stopPropagation();
    };

    const handleLogout = (event) => {
        handleClose();
        logout();
        event.stopPropagation();
    };

    const logout = async () => {
        await AxiosPost("/api/logout");
        dispatch(userSlice.actions["failure"]({ error: "User logged out" }));
        history.push(`/login`);
    };

    const getName = (name) => {
        if (name) {
            return name;
        }
        return "Login";
    };

    const getMenu = () => {
        return (
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem onClick={handleEdit}>
                    <ListItemIcon>
                        <EditIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Edit Profile" />
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <LockOpenIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                </MenuItem>
            </Menu>
        );
    };

    if (user.status !== "success") {
        return null;
    }

    if (!user.data || !user.data.id) {
        return null;
    }

    return (
        <>
            <ListItem button onClick={handleOpenMenuClick}>
                <ListItemIcon sx={{ padding: "1px" }}>
                    <BugAvatar {...user.data} />
                </ListItemIcon>
                <ListItemText primary={getName(user?.data?.name)} />
            </ListItem>
            {getMenu()}
        </>
    );
};

export default UserMenuItem;
