import { useParams } from "react-router-dom";
import React, { Suspense, useState } from "react";
import AxiosGet from "@utils/AxiosGet";
import Loading from "@components/Loading";
import useAsyncEffect from 'use-async-effect';

export default function PageHome(props) {
    const params = useParams();
    const panelId = params.panelid ?? "";
    const [panel, setPanel] = useState(null);

    useAsyncEffect(async () => {
        setPanel(await AxiosGet(`/api/panel/${panelId}`));
    }, [panelId]);
    
    const renderPanel = () => {
        if (panel === null) {
            return <Loading />;
        }
        const ImportedPanel = React.lazy(() => import(`@modules/${panel.module}/client/components/MainPanel`).catch(() => console.log('Error in importing')));

        return (
            <>
                <Suspense fallback={<Loading />}>
                    <ImportedPanel panel={panel}/>
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
