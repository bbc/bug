import React, { useEffect } from "react";
import Loading from "@components/Loading";
import PanelBuilding from "@components/PanelBuilding";
import PanelStopped from "@components/PanelStopped";
import { useDispatch } from "react-redux";
import pageTitleSlice from "../redux/pageTitleSlice";
import { Switch } from "react-router-dom";
import PanelConfigContext from "@core/PanelConfigContext";
import { useApiPoller } from "@utils/ApiPoller";

export default function ModuleWrapper({ panel, children }) {
    const dispatch = useDispatch();

    const config = useApiPoller({
        url: `/api/panelconfig/${panel.id}`,
        interval: 6000,
    });

    useEffect(() => {
        if (panel) {
            dispatch(pageTitleSlice.actions.set(panel.title));
        }
        return () => {
            dispatch(pageTitleSlice.actions.set(null));
        };
    }, [panel, dispatch]);

    if (!panel || !config) {
        return <Loading />;
    }

    if (panel._module.needsContainer) {
        if (panel._isbuilding) {
            return <PanelBuilding panel={panel} />;
        }

        if (!panel._isrunning) {
            return <PanelStopped panel={panel} />;
        }
    }

    return (
        <PanelConfigContext.Provider value={config.data}>
            <Switch>{children}</Switch>
        </PanelConfigContext.Provider>
    );
}
