import React from "react";
import MainPanel from "./panels/MainPanel";
import EditPanel from "./panels/EditPanel";
import { Switch, Route } from "react-router-dom";

export default function Module(props) {
    return (
        <>
            <Switch>
                <Route path="/edit">
                    <EditPanel {...props}/>
                </Route>
                <Route path="/">
                    <MainPanel {...props}/>
                </Route>
            </Switch>
        </>
    );
}
