import React from "react";
import PageHome from "./PageHome";
import PagePanel from "./PagePanel";
import PagePanels from "./PagePanels";
import PagePanelsAdd from "./PagePanelsAdd";
import PageSystem from "./PageSystem";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import NavDesktop from '@components/NavDesktop';
import NavMobile from '@components/NavMobile';
import Hidden from '@material-ui/core/Hidden';

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
            <div className={classes.pagecontent}>
                <Switch>
                    <Route exact path="/">
                        <PageHome />
                    </Route>
                    <Route exact path="/panels">
                        <PagePanels />
                    </Route>
                    <Route exact path="/panels/add">
                        <PagePanelsAdd />
                    </Route>
                    <Route path="/panel/:panelid">
                        <PagePanel />
                    </Route>
                    <Route exact path="/system">
                        <PageSystem />
                    </Route>
                </Switch>
            </div>
        </>
    )

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
