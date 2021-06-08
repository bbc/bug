import { useParams } from "react-router-dom";
import React from "react";
import Loading from "@components/Loading";
import { useSelector } from "react-redux";
import { usePanelConfig } from "@data/PanelConfig";
import { Redirect } from "react-router";

import * as Modules from "../../../modules/*/client/Module.jsx";

export default function PagePanel(props) {
    const params = useParams();
    const panelId = params.panelid ?? "";
    const panelConfig = useSelector((state) => state.panelConfig);

    // use websockets to listen for updates to these endpoints
    usePanelConfig({ panelId });

    if (panelConfig.status === "loading") {
        return <Loading />;
    }
    if (panelConfig.status === "success") {
        if (!panelConfig.data) {
            // the panel doesn't exist - we'll just dump back to the home page
            return <Redirect push to={{ pathname: "/" }} />;
        }
        if (Modules["modules"][panelConfig.data.module]) {
            const Module = Modules["modules"][panelConfig.data.module]["client"]["Module"];
            return <Module panelId={panelId} />;
        }
        return null;
    }
    return null;
}
