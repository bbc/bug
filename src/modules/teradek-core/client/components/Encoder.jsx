import React from "react";
import PanelTabbedForm from "@core/PanelTabbedForm";
import { Redirect } from "react-router";
import EncoderPreview from "./encoderDetails/EncoderPreview";
import EncoderStatistics from "./encoderDetails/EncoderStatistics";
import EncoderDetails from "./encoderDetails/EncoderDetails";
import Loading from "@components/Loading";
import { useApiPoller } from "@utils/ApiPoller";
import { useParams } from "react-router-dom";

export default function Interface() {
    const params = useParams();
    const [redirectUrl, setRedirectUrl] = React.useState(null);

    const handleBackClicked = () => {
        setRedirectUrl(`/panel/${params.panelId}`);
    };

    const encoder = useApiPoller({
        url: `/container/${params.panelId}/device/${params.encoderId}`,
        interval: 1000,
    });

    if (encoder.status === "idle" || encoder.status === "loading") {
        return <Loading height="30vh" />;
    }
    if (encoder.status === "success" && !encoder.data) {
        return <>Encoder not found</>;
    }

    if (redirectUrl) {
        return <Redirect push to={{ pathname: redirectUrl }} />;
    }

    return (
        <>
            <PanelTabbedForm
                onClose={handleBackClicked}
                labels={["Preview", "Statistics", "Details"]}
                content={[
                    <EncoderPreview
                        encoder={encoder?.data}
                        panelId={params.panelId}
                    />,
                    <EncoderStatistics
                        encoder={encoder?.data}
                        panelId={params.panelId}
                    />,
                    <EncoderDetails
                        encoder={encoder?.data}
                        panelId={params.panelId}
                    />,
                ]}
            ></PanelTabbedForm>
        </>
    );
}
