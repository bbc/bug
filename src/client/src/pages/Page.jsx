import React from "react";
import PageHome from "./PageHome";
import PagePanel from "./PagePanel";
import PagePanels from "./PagePanels";
import PagePanelsAdd from "./PagePanelsAdd";
import PagePanelsEdit from "./PagePanelsEdit";
import PageSystem from "./PageSystem";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import NavDesktop from "@components/NavDesktop";
import NavMobile from "@components/NavMobile";
import Hidden from "@material-ui/core/Hidden";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
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
        // padding: theme.spacing(3),
    },
    pagecontent: {
        padding: theme.spacing(3),
        "@media (max-width:1200px)": {
            padding: theme.spacing(2),
        },
        "@media (max-width:1024px)": {
            padding: theme.spacing(1),
        },
        "@media (max-width:600px)": {
            padding: theme.spacing(0),
        },
        "@media (max-height:400px)": {
            padding: 2
        }
    },
    homePageContent: {
        padding: 12,
        "@media (max-width:1200px)": {
            padding: 8,
        },
        "@media (max-width:1024px)": {
            padding: 4,
        },
        "@media (max-width:600px)": {
            padding: 0,
        },
    },
    bugLogo: {
        color: theme.palette.secondary.main,
        padding: "0.8rem",
    },
}));

const Page = (props) => {
    const classes = useStyles();

    const Content = () => (
        <>
            <div className={classes.toolbar} />
            <Switch>
                <Route exact path="/">
                    <div className={classes.homePageContent}>
                        <PageHome />
                    </div>
                </Route>
                <Route exact path="/panels">
                    <div className={classes.pagecontent}>
                        <PagePanels />
                    </div>
                </Route>
                <Route exact path="/panels/add">
                    <div className={classes.pagecontent}>
                        <PagePanelsAdd />
                    </div>
                </Route>
                <Route exact path="/panels/edit">
                    <div className={classes.pagecontent}>
                        <PagePanelsEdit />
                    </div>
                </Route>
                <Route path="/panel/:panelid">
                    <div className={classes.pagecontent}>
                        <PagePanel />
                    </div>
                </Route>
                <Route exact path="/system">
                    <div className={classes.pagecontent}>
                        <PageSystem />
                    </div>
                </Route>
            </Switch>
        </>
    );

    return (
        <Router>
            <div className={classes.root}>
                <Hidden xsDown>
                    <NavDesktop>
                        <Content />
                    </NavDesktop>
                </Hidden>
                <Hidden smUp>
                    <NavMobile>
                        <Content />
                    </NavMobile>
                </Hidden>
            </div>
        </Router>
    );
};

export default Page;
