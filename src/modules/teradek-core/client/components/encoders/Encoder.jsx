import React from "react";
import PanelTabbedForm from "@core/PanelTabbedForm";
import { useHistory } from "react-router-dom";
import EncoderPreview from "./tabs/EncoderPreview";
import EncoderStatistics from "./tabs/EncoderStatistics";
import EncoderDetails from "./tabs/EncoderDetails";
import Loading from "@components/Loading";
import { useApiPoller } from "@utils/ApiPoller";
import { useParams } from "react-router-dom";

export default function Encoder() {
    const params = useParams();
    const history = useHistory();

    const handleBackClicked = () => {
        history.push(`/panel/${params.panelId}`);
    };

    const device = useApiPoller({
        url: `/container/${params.panelId}/device/${params.encoderId}`,
        interval: 1000,
    });

    if (device.status === "idle" || device.status === "loading") {
        return <Loading />;
    }
    if (device.status === "success" && !device.data) {
        return <>Encoder not found</>;
    }

    return (
        <>
            <PanelTabbedForm
                onClose={handleBackClicked}
                labels={["Details", "Statistics", "Preview"]}
                content={[
                    <EncoderDetails encoder={device?.data} panelId={params.panelId} />,
                    <EncoderStatistics encoder={device?.data} panelId={params.panelId} />,
                    <EncoderPreview encoder={device?.data} panelId={params.panelId} />,
                ]}
            ></PanelTabbedForm>
        </>
    );
}
