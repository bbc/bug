import React from "react";
import MpegEncoderServicesList from "../components/MpegEncoderServicesList";
import BugPanelTabbedForm from "@core/BugPanelTabbedForm";
import AxiosGet from "@utils/AxiosGet";
import useAsyncEffect from "use-async-effect";
import BugLoading from "@core/BugLoading";

export default function MainPanel({ panelId }) {
    const [features, setFeatures] = React.useState(null);

    useAsyncEffect(async () => {
        setFeatures(await AxiosGet(`/container/${panelId}/chassis/features`));
    }, []);

    if (!features) {
        return <BugLoading height="30vh" />;
    }

    const tabLabels = [];
    const tabLocations = [];
    const tabContent = [];

    if (features.includes("encoder")) {
        tabLabels.push("MPEG Encoders");
        tabLocations.push(`/panel/${panelId}/display/mpegencoders`);
        tabContent.push(<MpegEncoderServicesList panelId={panelId} />);
    }
    if (features.includes("decoder")) {
        tabLabels.push("MPEG Decoders");
        tabLocations.push(`/panel/${panelId}/display/mpegdecoders`);
        tabContent.push(<>MPEG Decoders</>);
    }
    if (features.includes("encoder-j2k")) {
        tabLabels.push("J2K Encoders");
        tabLocations.push(`/panel/${panelId}/display/j2kencoders`);
        tabContent.push(<>J2K Decoders</>);
    }
    if (features.includes("decoder-j2k")) {
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
