import { useParams } from "react-router-dom";
import React, { Suspense } from "react";
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
    const dispatch = useDispatch();
    const panel = useSelector((state) => state.panel);

    // we load the panel here so we can get the module and panel title
    // we cant use the redux panellist, otherwise it'd re-render every time the list changes (which is a lot)
    useAsyncEffect(
        async () => {
            let tempPanel = await AxiosGet(`/api/panel/${panelId}`);

            // we store it in redux so that the toolbar can use it too
            dispatch(panelSlice.actions.set(tempPanel));

            // update the page title
            if(tempPanel !== null) {
                dispatch(pageTitleSlice.actions.set(tempPanel?.title));
            }
        },
        [panelId]
    );

    if (panel === null) {
        return <Loading />;
    }

    // import the page contents from the module
    const Module = React.lazy(() =>
        import(`@modules/${panel.module}/client/Module`).catch(() => console.log("Error in importing"))
    );

    return (
        <>
            <Suspense fallback={<Loading />}>
                <Module panelId={panelId} />
            </Suspense>
        </>
    );
}
