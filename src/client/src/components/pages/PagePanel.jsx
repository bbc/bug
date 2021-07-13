import { useParams, useLocation } from "react-router-dom";
import React from "react";
import Loading from "@components/Loading";
import { useSelector } from "react-redux";
import { usePanelConfig } from "@data/PanelConfig";
import { Redirect } from "react-router";
import * as Modules from "../../../../modules/*/client/Module.jsx";
import { useDispatch } from "react-redux";
import panelDataSlice from "@redux/panelDataSlice";

export default function PagePanel(props) {
    const params = useParams();
    const panelId = params.panelid ?? "";
    const panelConfig = useSelector((state) => state.panelConfig);
    const moduleName = panelConfig.data ? panelConfig.data.module : null;
    const location = useLocation();
    const dispatch = useDispatch();

    React.useEffect(() => {
        // clear any panel data from the previous page
        dispatch(panelDataSlice.actions.clear());
        // the dependency on the panelId makes sure it only gets cleared when the panel changes
    }, [panelId]);

    // use websockets to listen for updates to these endpoints
    usePanelConfig({ panelId });

    // we memoize this as we don't care if the panelconfig has changed in here - just the status or id
    return React.useMemo(() => {
        if (panelConfig.status !== "success") {
            return <Loading />;
        }

        if (Modules["modules"][moduleName]) {
            const Module = Modules["modules"][moduleName]["client"]["Module"];
            // we only include pathname here to trigger a re-render if the URL changes
            return <Module panelId={panelId} pathname={location.pathname} />;
        }

        // the panel doesn't exist - we'll just dump back to the home page
        return <Redirect push to={{ pathname: "/" }} />;
    }, [panelConfig.status, panelId, moduleName, location.pathname]);
}
