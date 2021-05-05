import React from "react";
import MainPanel from "./panels/MainPanel";
import EditPanel from "./panels/EditPanel";
import { Switch, Route, Redirect } from "react-router-dom";
import ModuleWrapper from "@core/ModuleWrapper";
import { useSelector } from "react-redux";

export default function Module({ panelId }) {

    const panel = useSelector((state) => {
        let panelFilter = state.panelList.data.filter((item) => item.id === panelId);
        return panelFilter[0];
    });

    const getConfiguration = () => {
        if (panel.config.needsConfigured) {
            return (
                <Redirect to={`/panel/${panelId}/edit`} />
            );
        }
    };

    return (
        <ModuleWrapper panelId={panelId}>
            <Switch>
                <Route exact path="/panel/:panelId/">
                    <MainPanel config={panel?.config} />
                    {getConfiguration()}
                </Route>
                <Route exact path="/panel/:panelId/edit">
                    <EditPanel config={panel?.config} />
                </Route>
            </Switch>
        </ModuleWrapper>
    );
}
