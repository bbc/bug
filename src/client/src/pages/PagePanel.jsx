import { useParams } from "react-router-dom";
import React, { Suspense, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import ApiPoller from "@utils/ApiPoller";
import Loading from "@components/Loading";
import MainPanel from "@modules/bmd-videohub/client/components/MainPanel";

const useStyles = makeStyles({
    root: {},
});

// const ImportedPanel = React.lazy(() => import(`@modules/bmd-videohub/client/components/MainPanel`));
// const ImportedPanel = React.lazy((moduleName) => import(`@modules/${moduleName}/client/components/MainPanel`));

// const ImportedPanel = (moduleName) => React.lazy(() => import(`@modules/${moduleName}/client/components/MainPanel`));

export default function PageHome(props) {
    const classes = useStyles();
    const params = useParams();
    const panelId = params.panelid ?? "";
    const [panel, setPanel] = React.useState({
        status: "idle",
        data: null,
        error: null,
    });



    const renderPanel = () => {
        if (!panel.data) {
            return <Loading />;
        }
        console.log(panel);
        // const ImportedPanel = React.lazy(() => import(`@modules/${moduleName}/client/components/MainPanel`));
        return (
            <>
                <ApiPoller
                    url={`/api/panel/config/${panelId}`}
                    interval="30000"
                    onChanged={(result) => setPanel(result)}
                />
                Panel id {panelId}
                <Suspense fallback={<div>Loading...</div>}>
                    {/* React.lazy(() => import(`${props.component}`)) */}
                </Suspense>
                <MainPanel></MainPanel>
            </>
        );
    };

    return (
        <>
            <ApiPoller url={`/api/panel/config/${panelId}`} interval="30000" onChanged={(result) => setPanel(result)} />
            {renderPanel()}
        </>
    );
}
