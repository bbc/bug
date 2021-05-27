import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ModuleRoute({ children, path }) {
    const panelConfig = useSelector((state) => state.panelConfig);

    const getConfiguration = () => {
        if (panelConfig.data.needsConfigured && children.type.name !== "ConfigPanel") {
            return <Redirect to={`/panel/${panelConfig.data.id}/config`} />;
        }
    };

    return (
        <>
            <Route exact path={path}>
                {children}
                {getConfiguration()}
            </Route>
        </>
    );
}
