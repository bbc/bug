import React from "react";
import { makeStyles } from "@mui/styles";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import MuiToolbar from "@mui/material/Toolbar";
import Toolbar from "@components/toolbars/ToolbarRouter";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@components/Menu";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        width: "100%",
    },
    appBar: {
        backgroundColor: theme.palette.menu.main,
        zIndex: theme.zIndex.drawer + 1,
    },
    drawer: {
        "& .MuiDrawer-paper": {
            maxWidth: "90%",
            minWidth: "280px",
        },
    },
    content: {
        position: "relative",
        flexGrow: 1,
    },
}));

const NavMobile = (props) => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    return (
        <div className={classes.root}>
            <AppBar position="fixed" className={classes.appBar} elevation={1}>
                <MuiToolbar style={{ paddingRight: 0 }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerToggle}
                        edge="start"
                        className={classes.menuButton}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Toolbar></Toolbar>
                </MuiToolbar>
            </AppBar>
            <Drawer className={classes.drawer} transitionDuration={100} open={open} onClose={handleDrawerToggle}>
                <div onClick={handleDrawerToggle}>
                    <Menu />
                </div>
            </Drawer>
            <div className={classes.content}>{props.children}</div>
        </div>
    );
};

export default NavMobile;
