import React from "react";
import MpegEncoderServicesList from "../components/MpegEncoderServicesList";
import MpegDecoderServicesList from "../components/MpegDecoderServicesList";
import BugPanelTabbedForm from "@core/BugPanelTabbedForm";
import BugLoading from "@core/BugLoading";
import { useApiPoller } from "@hooks/ApiPoller";
import BugNoData from "@core/BugNoData";

export default function MainPanel({ panelId }) {
    const features = useApiPoller({
        url: `/container/${panelId}/chassis/features`,
        interval: 2000,
    });

    if (features.status === "loading" || !features.data) {
        return <BugLoading height="30vh" />;
    }

    if (features.data.length === 0) {
        return <BugNoData title="No codec channels found" showConfigButton={false} />;
    }
    const tabLabels = [];
    const tabLocations = [];
    const tabContent = [];

    if (features.data.includes("encoder")) {
        tabLabels.push("MPEG Encoders");
        tabLocations.push(`/panel/${panelId}/display/mpegencoders`);
        tabContent.push(<MpegEncoderServicesList panelId={panelId} />);
    }
    if (features.data.includes("decoder")) {
        tabLabels.push("MPEG Decoders");
        tabLocations.push(`/panel/${panelId}/display/mpegdecoders`);
        tabContent.push(<MpegDecoderServicesList panelId={panelId} />);
    }
    if (features.data.includes("encoder-j2k")) {
        tabLabels.push("J2K Encoders");
        tabLocations.push(`/panel/${panelId}/display/j2kencoders`);
        tabContent.push(<>J2K Decoders</>);
    }
    if (features.data.includes("decoder-j2k")) {
        tabLabels.push("J2K Decoders");
        tabLocations.push(`/panel/${panelId}/display/j2kdecoders`);
        tabContent.push(<>J2K Decoders</>);
    }

    return (
        <>
            <BugPanelTabbedForm
                labels={tabLabels}
                locations={tabLocations}
                content={tabContent}
                contentProps={{ elevation: 0 }}
            ></BugPanelTabbedForm>
        </>
    );
}
