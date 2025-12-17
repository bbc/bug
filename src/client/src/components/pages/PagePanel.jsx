import BugLoading from "@core/BugLoading";
import { usePanelConfig } from "@data/PanelConfigHandler";
import panelDataSlice from "@redux/panelDataSlice";
import { lazy, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useParams } from "react-router-dom";

// build-time module map using require.context
const moduleContext = require.context("../../../../modules", true, /client\/Module\.jsx$/);
const Modules = {};
moduleContext.keys().forEach(function (key) {
    const match = key.match(/\.\/([^/]+)\/client\/Module\.jsx$/);
    if (match) {
        const moduleName = match[1];
        Modules[moduleName] = lazy(function () {
            return import(
                /* webpackChunkName: "[request]" */
                `../../../../modules/${moduleName}/client/Module.jsx`
            );
        });
    }
});

export default function PagePanel() {
    const params = useParams();
    const panelId = params.panelId || "";
    const panelConfig = useSelector((state) => state.panelConfig);
    const moduleName = panelConfig.data ? panelConfig.data.module : null;
    const dispatch = useDispatch();

    // clear previous panel data when panelId changes
    useEffect(() => {
        dispatch(panelDataSlice.actions.clear());
    }, [panelId, dispatch]);

    // fetch panel config via websocket handler
    usePanelConfig({ panelId });

    // show loading if panel config is not ready
    if (panelConfig.status !== "success") {
        return <BugLoading />;
    }

    // redirect if module does not exist
    if (!moduleName || !Modules[moduleName]) {
        console.error("module " + moduleName + " not found");
        return <Navigate replace to="/" />;
    }

    const ModuleComponent = Modules[moduleName];

    return (
        <ModuleComponent panelId={panelId}>
            <Outlet />
        </ModuleComponent>
    );
}
