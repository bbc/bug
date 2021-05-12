import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import PanelConfigContext from '@core/PanelConfigContext';

export default function ModuleRoute({ children, path }) {

    const config = useContext(PanelConfigContext);

    const getConfiguration = () => {
        if (config?.needsConfigured && (children.type.name !== 'EditPanel')) {
            return (
                <Redirect to={`/panel/${config.id}/edit`} />
            );
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