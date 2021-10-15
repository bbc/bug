import React from "react";
import { Route } from "react-router-dom";

export default function ModuleRoute({ children, path }) {
    return (
        <>
            <Route exact path={path}>
                {children}
            </Route>
        </>
    );
}
