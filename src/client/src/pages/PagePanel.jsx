import { useParams } from "react-router-dom";
import React, { Suspense } from "react";
import Loading from "@components/Loading";
import { useSelector } from "react-redux";
import { usePanelConfig } from "@data/PanelConfig";

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
        // import the page contents from the module
        const Module = React.lazy(() =>
            import(`@modules/${panelConfig.data.module}/client/Module`).catch(() => console.log("Error in importing"))
        );
        return (
            <>
                <Suspense fallback={<Loading />}>
                    <Module panelId={panelId} />
                </Suspense>
            </>
        );
    }
    return null;
}
