import { useParams } from "react-router-dom";
import React, { Suspense, useEffect } from "react";
import AxiosGet from "@utils/AxiosGet";
import Loading from "@components/Loading";
import useAsyncEffect from 'use-async-effect';

export default function PageHome(props) {
    const params = useParams();
    const panelId = params.panelid ?? "";
    const [panel, setPanel] = React.useState(null);

    useAsyncEffect(async () => {
        setPanel(await AxiosGet(`/api/panel/${panelId}`));
    }, []);

    const renderPanel = () => {
        if (panel === null) {
            return <Loading />;
        }
        const ImportedPanel = React.lazy(() => import(`@modules/${panel.module}/client/components/MainPanel`).catch(() => console.log('Error in importing')));
        return (
            <>
                <Suspense fallback={<div>Loading...</div>}>
                    <ImportedPanel id={panelId}/>
                </Suspense>
            </>
        );
    };

    return (
        <div key={panelId}>
            {renderPanel()}
        </div>
    );
}
