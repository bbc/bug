import { useParams } from "react-router-dom";
import React, { Suspense } from "react";
import ApiPoller from "@utils/ApiPoller";
import Loading from "@components/Loading";
import PageTitle from '@components/PageTitle';

export default function PageHome(props) {
    const params = useParams();
    const panelId = params.panelid ?? "";
    const [panel, setPanel] = React.useState({
        status: "idle",
        data: null,
        error: null,
    });

    const renderPanel = () => {
        if (panel.status === 'idle') {
            return <Loading />;
        }
        if (panel.status === 'loading') {
            return <Loading />;
        }
        const ImportedPanel = React.lazy(() => import(`@modules/${panel.data.module}/client/components/ConfigPanel`).catch(() => console.log('Error in importing')));
        return (
            <>
                <Suspense fallback={<div>Loading...</div>}>
                    <PageTitle>{ 'Settings | '+panel?.data?.title }</PageTitle>
                    <ImportedPanel id={panelId}/>
                </Suspense>
            </>
        );
    };

    return (
        <div key={panelId}>
            <ApiPoller url={`/api/panel/${panelId}`} interval="30000" onChanged={(result) => setPanel(result)} />
            {renderPanel()}
        </div>
    );
}
