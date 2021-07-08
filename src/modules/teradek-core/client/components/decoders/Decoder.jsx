import React from "react";
import PanelTabbedForm from "@core/PanelTabbedForm";
import { useHistory } from "react-router-dom";
import DecoderDetails from "./tabs/DecoderDetails";
import DecoderStatistics from "./tabs/DecoderStatistics";
import Loading from "@components/Loading";
import { useApiPoller } from "@utils/ApiPoller";
import { useParams } from "react-router-dom";

export default function Decoder() {
    const params = useParams();
    const history = useHistory();

    const handleBackClicked = () => {
        history.push(`/panel/${params.panelId}`);
    };

    const device = useApiPoller({
        url: `/container/${params.panelId}/device/${params.decoderId}`,
        interval: 1000,
    });

    if (device.status === "idle" || device.status === "loading") {
        return <Loading />;
    }
    if (device.status === "success" && !device.data) {
        return <>Decoder not found</>;
    }

    return (
        <>
            <PanelTabbedForm
                onClose={handleBackClicked}
                labels={["Details", "Statistics"]}
                content={[
                    <DecoderDetails decoder={device?.data} panelId={params.panelId} />,
                    <DecoderStatistics decoder={device?.data} panelId={params.panelId} />,
                ]}
            ></PanelTabbedForm>
        </>
    );
}
