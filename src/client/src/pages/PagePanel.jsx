import { useParams } from "react-router-dom";
import React, { Suspense, useState, useEffect } from "react";
import AxiosGet from "@utils/AxiosGet";
import Loading from "@components/Loading";
import useAsyncEffect from 'use-async-effect';
import { useDispatch } from "react-redux";
import pageTitleSlice from "../redux/pageTitleSlice";

export default function PageHome(props) {
    const params = useParams();
    const panelId = params.panelid ?? "";
    const [panel, setPanel] = useState({title: 'Panel' });
    const [config, setConfig] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(pageTitleSlice.actions.set(panel?.title));
    });

    useAsyncEffect(async () => {
        setPanel(await AxiosGet(`/api/panel/${panelId}`));
    }, [panelId]);

    useAsyncEffect(async () => {
        setConfig(await AxiosGet(`/api/panel/config/${panelId}`));
    }, [panelId]);
    
    const renderPanel = () => {
        if (panel === null) {
            return <Loading />;
        }
        const ImportedPanel = React.lazy(() => import(`@modules/${panel.module}/client/components/MainPanel`).catch(() => console.log('Error in importing')));

        return (
            <>
                <Suspense fallback={<Loading />}>
                    <ImportedPanel id={panelId} config={config} panel={panel}/>
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
