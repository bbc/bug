import React, { useEffect, useState } from "react";
import Loading from "@components/Loading";
import PanelBuilding from "@components/PanelBuilding";
import PanelStopped from "@components/PanelStopped";
import { useDispatch } from "react-redux";
import pageTitleSlice from "../redux/pageTitleSlice";
import { useSelector } from "react-redux";
import { Switch } from "react-router-dom";
import PanelContext from "@core/PanelContext";
import { useApiPoller } from "@utils/ApiPoller";

export default function ModuleWrapper({ panelId, children }) {
    const dispatch = useDispatch();
    const [config, setConfig] = useState(null);

    const panel = useSelector((state) => {
        let panelFilter = state.panelList.data.filter((item) => item.id === panelId);
        return panelFilter[0];
    });

    useApiPoller({
        url: `/api/panelconfig/${panelId}`,
        interval: 6000,
        onChanged: (result) => setConfig(result?.data),
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
        <PanelContext.Provider value={config}>
            <Switch>{children}</Switch>
        </PanelContext.Provider>
    );
}
