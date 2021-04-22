import React from "react";
import MainPanel from "./panels/MainPanel";
import ConfigPanel from "./panels/ConfigPanel";
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
