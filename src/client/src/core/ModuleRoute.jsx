import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import PanelContext from '@core/PanelContext';

export default function ModuleRoute({ children, path }) {

    const config = useContext(PanelContext);

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