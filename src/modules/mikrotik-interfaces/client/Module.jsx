import React from "react";
import MainPanel from "./components/MainPanel";
import ConfigPanel from "./components/ConfigPanel";
import { Switch, Route } from "react-router-dom";

export default function Module(props) {
    return (
        <>
            <Switch>
                <Route path="/">
                    <MainPanel {...props}/>
                </Route>
                <Route path="/config">
                    <ConfigPanel {...props}/>
                </Route>
            </Switch>
        </>
    );
}
