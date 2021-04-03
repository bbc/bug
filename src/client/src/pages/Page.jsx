import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Menu from "@components/Menu";
import PageHome from "./PageHome";
import PagePanel from "./PagePanel";
import PagePanelConfig from "./PagePanelConfig";
import PageSettings from "./PageSettings";
import PagePanels from "./PagePanels";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
    }
});

export default function Page() {
    const classes = useStyles();

    return (
        <React.Fragment>
            <div className={classes.root}>
                <Router>
                    <Menu>
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
                            <Route exact path="/panelconfig/:panelid">
                                <PagePanelConfig />
                            </Route>
                        </Switch>
                    </Menu>
                </Router>
            </div>
        </React.Fragment>
    );
}
