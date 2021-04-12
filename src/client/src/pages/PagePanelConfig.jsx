import { useParams } from "react-router-dom";
import React, { Suspense, useState, useEffect } from "react";
import ApiPoller from "@utils/ApiPoller";
import Loading from "@components/Loading";
import PageTitle from '@components/PageTitle';

export default function PageHome(props) {
    const params = useParams();
    const panelId = params.panelid ?? "";
    const [config, setConfig] = useState(null);

    const renderPanel = () => {
        let panel = (<Loading/>);
        if (config) {
            const ImportedPanel = React.lazy(() => import(`@modules/${config?.module}/client/components/ConfigPanel`).catch(() => console.log('Error in importing')));
            panel = (
                <React.Fragment>
                    <Suspense fallback={<Loading/>}>
                        <PageTitle>{ 'Settings | '+config?.title }</PageTitle>
                        <ImportedPanel config={config}/>
                    </Suspense>
                </React.Fragment>
            );
        }
        return panel;
    };

    return (
        <div key={panelId}>
            <ApiPoller url={`/api/panel/config/${panelId}`} interval="30000" onChanged={(result) => setConfig(result?.data)} />
            {renderPanel()}
        </div>
    );
}
