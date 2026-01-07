import BugAvatar from "@core/BugAvatar";
import EditIcon from "@mui/icons-material/Edit";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import userSlice from "@redux/userSlice";
import AxiosPost from "@utils/AxiosPost";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const UserMenuItem = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const open = Boolean(anchorEl);

    const handleOpenMenuClick = (event) => {
        if (user?.status === "success") {
            setAnchorEl(event.currentTarget);
        } else {
            navigate("/login");
        }
        event.stopPropagation();
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleEdit = (event) => {
        navigate(`/system/user/${user?.data?.id}`);
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
        navigate(`/login`);
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
            <ListItemButton onClick={handleOpenMenuClick}>
                <ListItemIcon sx={{ padding: "1px" }}>
                    <BugAvatar {...user.data} />
                </ListItemIcon>
                <ListItemText primary={getName(user?.data?.name)} />
            </ListItemButton>
            {getMenu()}
        </>
    );
};

export default UserMenuItem;
