import React from "react";
import PageHome from "./PageHome";
import PagePanel from "./PagePanel";
import PageTitle from "@components/PageTitle";
import PagePanelConfig from "./PagePanelConfig";
import PageSettings from "./PageSettings";
import PagePanels from "./PagePanels";
import PageSystem from "./PageSystem";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import Menu from "@components/Menu";

const drawerWidth = 275;

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
    },
    appBar: {
        backgroundColor: theme.palette.menu.main,
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 20,
    },
    toolbarIcon: {
        marginRight: 8,
    },
    hide: {
        display: "none",
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: "nowrap",
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: "hidden",
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up("sm")]: {
            width: theme.spacing(7) + 1,
        },
    },
    link: {
        textDecoration: "none",
        color: "#cccccc",
        "&:hover": {
            color: "#fff",
        },
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
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    bugLogo: {
        color: theme.palette.secondary.main,
        padding: "0.8rem",
    },
}));

const Page = (props) => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    // const [title, setTitle] = React.useState("BUG");

    // const handleTitle = (newTitle) => {
    //     setTitle(newTitle);
    // };

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <Router>
            <div className={classes.root}>
                <AppBar
                    position="fixed"
                    className={clsx(classes.appBar, {
                        [classes.appBarShift]: open,
                    })}
                >
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            className={clsx(classes.menuButton, {
                                [classes.hide]: open,
                            })}
                        >
                            <MenuIcon />
                        </IconButton>
                        <PageTitle></PageTitle>
                    </Toolbar>
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
                    <div className={classes.toolbar}>
                        <IconButton onClick={handleDrawerClose}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </div>

                    <Menu />
                </Drawer>
                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    <Switch>
                        <Route exact path="/">
                            <PageHome />
                        </Route>
                        <Route exact path="/panels">
                            <PagePanels />
                        </Route>
                        <Route exact path="/settings">
                            <PageSettings />
                        </Route>
                        <Route exact path="/panel/:panelid">
                            <PagePanel />
                        </Route>
                        <Route exact path="/panel/config/:panelid">
                            <PagePanelConfig />
                        </Route>
                        <Route exact path="/system">
                            <PageSystem />
                        </Route>
                    </Switch>
                </main>
            </div>
        </Router>
    );
};

export default Page;
