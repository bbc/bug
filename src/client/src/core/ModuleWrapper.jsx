import React, { useEffect } from "react";
import Loading from "@components/Loading";
import PanelBuilding from "@components/PanelBuilding";
import PanelStopped from "@components/PanelStopped";
import { useDispatch } from "react-redux";
import pageTitleSlice from "../redux/pageTitleSlice";
import { useSelector } from 'react-redux'

export default function ModuleWrapper({ panelId, children }) {
    const dispatch = useDispatch();

    const panel = useSelector((state) => {
        let panelFilter = state.panelList.data.filter((item) => item.id === panelId);
        return panelFilter[0];
    });

    useEffect(() => {
        if (panel) {
            dispatch(pageTitleSlice.actions.set(panel.title));
        }
        return () => {
            dispatch(pageTitleSlice.actions.set(null));
        };
    }, [panelId]);

    if (panel === null) {
        return <Loading />;
    }

    if (panel._isbuilding) {
        return <PanelBuilding panel={panel} />;
    }

    if (!panel._isrunning) {
        return <PanelStopped panel={panel} />;
    }

    return children;
}
