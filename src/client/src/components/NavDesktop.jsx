import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import MuiToolbar from "@material-ui/core/Toolbar";
import Toolbar from "@components/toolbars/ToolbarRouter";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import Menu from "@components/Menu";

const drawerWidth = 275;
const fullMenuWidth = 1024;

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        width: "100%",
    },
    appBar: {
        backgroundColor: theme.palette.menu.main,
        zIndex: theme.zIndex.drawer + 1,
    },
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
        width: theme.spacing(7) + 1,
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
        <div className={classes.root}>
            <AppBar position="fixed" className={classes.appBar} elevation={1}>
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
                <Menu showGroups={open} />
            </Drawer>
            <div className={classes.content}>{props.children}</div>
        </div>
    );
};

export default NavDesktop;
