import React from "react";
import { useSelector } from "react-redux";
import PageHome from "./PageHome";
import PageLogin from "./PageLogin";
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
import PageSystemConfiguration from "@components/system/PageSystemConfiguration";
import PageSystemUsers from "@components/system/PageSystemUsers";
import PageSystemUserEdit from "@components/system/PageSystemUserEdit";
import PageSystemSecurity from "@components/system/PageSystemSecurity";
import PageSystemSecurityEdit from "@components/system/PageSystemSecurityEdit";
import PageSystemSoftware from "@components/system/PageSystemSoftware";
import PageSystemInfo from "@components/system/PageSystemInfo";
import PageSystemLogs from "@components/system/PageSystemLogs";
import PageSystemAbout from "@components/system/PageSystemAbout";
import PageSystemBackup from "@components/system/PageSystemBackup";
import Loading from "@components/Loading";
import { Redirect } from "react-router";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        height: "100%",
    },
    page: {
        position: "absolute",
        top: 64,
        bottom: 0,
        left: 0,
        right: 0,
        "@media (max-width:600px)": {
            top: 56,
        },
    },
    pagecontent: {
        height: "100%",
        overflow: "scroll",
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
            padding: 2,
        },
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
    loginPageContent: {
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

const PageRouter = (props) => {
    const classes = useStyles();
    const user = useSelector((state) => state.user);
    const strategies = useSelector((state) => state.strategies);

    const PageContent = () => (
        <>
            <div className={classes.page}>
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
                    <Route exact path="/system/configuration">
                        <div className={classes.pagecontent}>
                            <PageSystemConfiguration />
                        </div>
                    </Route>
                    <Route exact path="/system/users">
                        <div className={classes.pagecontent}>
                            <PageSystemUsers />
                        </div>
                    </Route>
                    <Route exact path="/system/user">
                        <div className={classes.pagecontent}>
                            <PageSystemUserEdit />
                        </div>
                    </Route>
                    <Route exact path="/system/user/:userId">
                        <div className={classes.pagecontent}>
                            <PageSystemUserEdit />
                        </div>
                    </Route>
                    <Route exact path="/system/security">
                        <div className={classes.pagecontent}>
                            <PageSystemSecurity />
                        </div>
                    </Route>
                    <Route exact path="/system/security/:type">
                        <div className={classes.pagecontent}>
                            <PageSystemSecurityEdit />
                        </div>
                    </Route>
                    <Route exact path="/system/software">
                        <div className={classes.pagecontent}>
                            <PageSystemSoftware />
                        </div>
                    </Route>
                    <Route exact path="/system/info">
                        <div className={classes.pagecontent}>
                            <PageSystemInfo />
                        </div>
                    </Route>
                    <Route exact path="/system/logs">
                        <div className={classes.pagecontent}>
                            <PageSystemLogs />
                        </div>
                    </Route>
                    <Route exact path="/system/about">
                        <div className={classes.pagecontent}>
                            <PageSystemAbout />
                        </div>
                    </Route>
                    <Route exact path="/system/backup">
                        <div className={classes.pagecontent}>
                            <PageSystemBackup />
                        </div>
                    </Route>
                    <Route exact path="/login">
                        <Redirect to="/" />
                    </Route>
                </Switch>
            </div>
        </>
    );

    const routerContent = React.useMemo(() => (
        <Router>
            <div className={classes.root}>
                <Hidden xsDown>
                    <NavDesktop>
                        <PageContent />
                    </NavDesktop>
                </Hidden>
                <Hidden smUp>
                    <NavMobile>
                        <PageContent />
                    </NavMobile>
                </Hidden>
            </div>
        </Router>
    ));

    // strategies first. If they're not loaded then wait

    if (strategies.status !== "success") {
        return <Loading />;
    }

    // if they're loaded and none enabled, then we're done
    const enabledStrategiesCount = strategies.data.filter((eachStrategy) => eachStrategy.enabled).length;

    if (enabledStrategiesCount === 0) {
        return routerContent;
    }

    // if we've got to here, then there must be a strategy enabled
    if (user.status === "idle") {
        return <Loading />;
    }

    if (user.data && user.data.id !== null) {
        return routerContent;
    }

    return <PageLogin />;
};

export default PageRouter;
