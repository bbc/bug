import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import EditIcon from "@material-ui/icons/Edit";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import AxiosPost from "@utils/AxiosPost";
import userSlice from "@redux/userSlice";
import md5 from "crypto-js/md5";

const useStyles = makeStyles((theme) => ({
    icon: {
        padding: "1px",
    },
    small: {
        width: theme.spacing(3),
        height: theme.spacing(3),
    },
}));

const BugMenuIcon = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const [anchorEl, setAnchorEl] = useState(null);
    const history = useHistory();
    const open = Boolean(anchorEl);

    const handleOpenMenuClick = (event) => {
        console.log(user);
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

    const getGravatarImage = (email) => {
        if (email) {
            const hash = md5(email);
            const imageSource = `https://www.gravatar.com/avatar/${hash}`;
            return imageSource;
        }
        return null;
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
                <ListItemIcon className={classes.icon}>
                    <Avatar src={getGravatarImage(user?.data?.email)} className={classes.small}>
                        {getInitials(user?.data?.name)}
                    </Avatar>
                </ListItemIcon>
                <ListItemText primary={getName(user?.data?.name)} />
            </ListItem>
            {getMenu()}
        </>
    );
};

export default BugMenuIcon;
