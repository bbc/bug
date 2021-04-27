import { useParams } from "react-router-dom";
import React, { Suspense, useState } from "react";
import AxiosGet from "@utils/AxiosGet";
import Loading from "@components/Loading";
import useAsyncEffect from "use-async-effect";
import { useDispatch } from "react-redux";
import pageTitleSlice from "../redux/pageTitleSlice";
import panelSlice from "../redux/panelSlice";
import { useSelector } from "react-redux";

export default function PagePanel(props) {
    const params = useParams();
    const panelId = params.panelid ?? "";
    const [config, setConfig] = useState(null);
    const dispatch = useDispatch();
    const panel = useSelector((state) => state.panel);

    useAsyncEffect(
        async () => {
            let panel = await AxiosGet(`/api/panel/${panelId}`);
            dispatch(panelSlice.actions.set(panel));
            dispatch(pageTitleSlice.actions.set(panel?.title));
        },
        async () => {
            dispatch(panelSlice.actions.set(null));
        },
        [panelId]
    );

    useAsyncEffect(async () => {
        setConfig(await AxiosGet(`/api/panel/config/${panelId}`));
    }, [panelId]);


    const renderPanel = () => {
        if (panel === null) {
            return <Loading />;
        }
        const Module = React.lazy(() =>
            import(`@modules/${panel.module}/client/Module`).catch(() => console.log("Error in importing"))
        );

        return (
            <>
                <Suspense fallback={<Loading />}>
                    <Module panelid={panelId} config={config} panel={panel} />
                </Suspense>
            </>
        );
    };

    return <div key={panelId}>{renderPanel()}</div>;
}
