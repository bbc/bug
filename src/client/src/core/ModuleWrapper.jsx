import React, { useEffect } from "react";
import Loading from "@components/Loading";
import PanelBuilding from "@components/PanelBuilding";
import PanelStopped from "@components/PanelStopped";
import PanelCritical from "@components/PanelCritical";
import { useDispatch } from "react-redux";
import pageTitleSlice from "../redux/pageTitleSlice";
import { Switch } from "react-router-dom";
import { useSelector } from "react-redux";
import { usePanel } from "@data/Panel";

export default function ModuleWrapper({ panelId, children }) {
    const dispatch = useDispatch();
    const panelConfig = useSelector((state) => state.panelConfig);
    const panel = useSelector((state) => state.panel);

    usePanel({ panelId });

    useEffect(() => {
        if (panelConfig) {
            dispatch(pageTitleSlice.actions.set(panelConfig.data.title));
        }
        return () => {
            dispatch(pageTitleSlice.actions.set(null));
        };
    }, [panelConfig, dispatch]);

    if (panel.status === "loading") {
        return <Loading />;
    }

    // check protected routes
    let isProtected = false;
    if (panel?.data?._module?.protectedRoutes) {
        for (let eachRoute of panel.data._module.protectedRoutes) {
            if (window.location.pathname.endsWith(eachRoute)) {
                isProtected = true;
            }
        }
    }

    if (panel.status === "success") {
        const hasCritical = panel.data._status && panel.data._status.filter((x) => x.type === "critical").length > 0;

        if (!isProtected) {
            if (hasCritical) {
                return <PanelCritical panel={panel.data} />;
            }

            if (panel.data._module.needsContainer) {
                if (panel.data._dockerContainer._isBuilding) {
                    return <PanelBuilding panel={panel.data} />;
                }

                if (!panel.data._dockerContainer._isRunning) {
                    return <PanelStopped panel={panel.data} />;
                }
            }
        }
        return <Switch>{children}</Switch>;
    }
    return null;
}
