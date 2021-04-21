import React from "react";
import PageHome from "./PageHome";
import PagePanel from "./PagePanel";
import PagePanelConfig from "./PagePanelConfig";
import PagePanels from "./PagePanels";
import PagePanelAdd from "./PagePanelAdd";
import PageSystem from "./PageSystem";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import BugDesktopNav from '@components/BugDesktopNav';
import BugMobileNav from '@components/BugMobileNav';
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
                    <Route exact path="/settings">
                        <PageSettings />
                    </Route>
                    <Route exact path="/panel/add">
                        <PagePanelAdd />
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
            </div>
        </>
    )

    return (
        <Router>
            <div className={classes.root}>
                <Hidden xsDown>
                    <BugDesktopNav>
                        <Content />
                    </BugDesktopNav>
                </Hidden>
                <Hidden smUp>
                    <BugMobileNav>
                        <Content />
                    </BugMobileNav>
                </Hidden>
            </div>
        </Router>
    );
};

export default Page;
