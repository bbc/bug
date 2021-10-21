import React, { useEffect } from "react";
import { makeStyles } from "@mui/styles";
import clsx from "clsx";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import MuiToolbar from "@mui/material/Toolbar";
import Toolbar from "@components/toolbars/ToolbarRouter";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import Menu from "@components/Menu";
import BugScrollbars from "@core/BugScrollbars";

const drawerWidth = 275;
const fullMenuWidth = 1024;

const useStyles = makeStyles((theme) => ({
    menuButton: {
        marginRight: 20,
        marginLeft: 4,
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: "nowrap",
        "& .MuiPaper-root": {
            borderRightWidth: 0,
        },
    },
    drawerOpen: {
        width: drawerWidth,
    },
    drawerClose: {
        overflowX: "hidden",
        width: 56,
    },
    toolbar: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    },
    content: {
        position: "relative",
        flexGrow: 1,
    },
}));

const NavDesktop = (props) => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    useEffect(() => {
        if (window.innerWidth > fullMenuWidth) {
            // window is wide - open the menu by default
            setOpen(true);
        }
    }, []);

    return (
        <Box
            sx={{
                display: "flex",
                width: "100%",
                height: "100%",
                "@media (max-width:600px)": {
                    display: "none",
                },
            }}
        >
            <AppBar
                position="fixed"
                sx={{
                    backgroundColor: "menu.main",
                    zIndex: 1201,
                }}
                elevation={1}
            >
                <MuiToolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerToggle}
                        edge="start"
                        className={classes.menuButton}
                    >
                        {open ? <MenuOpenIcon /> : <MenuIcon />}
                    </IconButton>
                    <Toolbar></Toolbar>
                </MuiToolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                sx={{
                    "& .MuiDrawer-paper": { overflowY: "visible" },
                    "& .MuiGrid-container": { flexWrap: "nowrap" },
                }}
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                })}
                classes={{
                    paper: clsx({
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    }),
                }}
            >
                <div className={classes.toolbar}></div>
                <BugScrollbars>
                    <Menu showGroups={open} />
                </BugScrollbars>
            </Drawer>
            <div className={classes.content}>{props.children}</div>
        </Box>
    );
};

export default NavDesktop;
