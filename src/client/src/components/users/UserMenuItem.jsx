import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import EditIcon from "@mui/icons-material/Edit";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import AxiosPost from "@utils/AxiosPost";
import userSlice from "@redux/userSlice";
import useSounds from "@hooks/Sounds";
import getGravatarUrl from "@utils/getGravatarUrl";

const UserMenuItem = (props) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const [anchorEl, setAnchorEl] = useState(null);
    const history = useHistory();
    const open = Boolean(anchorEl);
    const click = useSounds("/sounds/switch-on.mp3");

    const handleOpenMenuClick = (event) => {
        click();
        if (user?.status === "success") {
            setAnchorEl(event.currentTarget);
        } else {
            history.push("/login");
        }
        event.stopPropagation();
    };

    const handleClose = () => {
        click();
        setAnchorEl(null);
    };

    const handleEdit = (event) => {
        click();
        history.push(`/system/user/${user?.data?.id}`);
        handleClose();
        event.stopPropagation();
    };

    const handleLogout = (event) => {
        click();
        handleClose();
        logout();
        event.stopPropagation();
    };

    const logout = async () => {
        await AxiosPost("/api/logout");
        dispatch(userSlice.actions["failure"]({ error: "User logged out" }));
        history.push(`/login`);
    };

    const getInitials = (name) => {
        if (name) {
            let initials = "";
            for (let word of name?.split(" ")) {
                initials += word.charAt(0);
            }
            return initials.toUpperCase();
        }
        return null;
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
                    <Avatar src={getGravatarUrl(user?.data?.email)} sx={{ width: "24px", height: "24px" }}>
                        {getInitials(user?.data?.name)}
                    </Avatar>
                </ListItemIcon>
                <ListItemText primary={getName(user?.data?.name)} />
            </ListItem>
            {getMenu()}
        </>
    );
};

export default UserMenuItem;
