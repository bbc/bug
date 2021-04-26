import React from "react";
import MainPanel from "./panels/MainPanel";
import EditPanel from "./panels/EditPanel";
import InterfacePanel from "./panels/InterfacePanel";
import { Switch, Route } from "react-router-dom";

export default function Module(props) {
    return (
        <>
            <Switch>
                <Route exact path="/panel/:panelid/edit">
                    <EditPanel {...props}/>
                </Route>
                <Route exact path="/panel/:panelid/">
                    <MainPanel {...props}/>
                </Route>
                <Route exact path="/panel/:panelid/interface/:interfaceid">
                    <InterfacePanel {...props}/>
                </Route>
            </Switch>
        </>
    );
}
