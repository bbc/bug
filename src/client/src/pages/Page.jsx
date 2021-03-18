import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Menu from "../components/Menu";
import PageHome from "./PageHome";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const useStyles = makeStyles({
    cols: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    colMenu: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 300,
        bottom: 0
    },
    colContent: {
        position: 'absolute',
        top: 0,
        left: 300,
        right: 0,
        bottom: 0,
        overflow: "scroll",
    },
});

export default function Page() {
    const classes = useStyles();

    return (
        <>
            <Router>
                <div className={classes.cols}>
                    <div className={classes.colMenu}>
                        <Menu />
                    </div>

                    <div className={classes.colContent}>
                        <Switch>
                            <Route exact path="/">
                                <PageHome />
                            </Route>
                        </Switch>
                    </div>
                </div>
            </Router>
        </>
    );
}
