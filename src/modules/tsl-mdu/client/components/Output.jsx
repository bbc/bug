import React from "react";
import { Redirect } from "react-router";
import Loading from "@components/Loading";
import { useApiPoller } from "@utils/ApiPoller";

export default function Interface({ panelId, outputNumber }) {
    const [redirectUrl, setRedirectUrl] = React.useState(null);

    const handleBackClicked = () => {
        setRedirectUrl(`/panel/${panelId}`);
    };

    const output = useApiPoller({
        url: `/container/${panelId}/output/${outputNumber}`,
        interval: 2000,
    });

    if (output.status === "idle" || output.status === "loading") {
        return <Loading height="30vh" />;
    }
    if (output.status === "success" && !output.data) {
        return <>Output not found</>;
    }

    if (redirectUrl) {
        return <Redirect push to={{ pathname: redirectUrl }} />;
    }

    return <>UNDER CONSTRUCTION {output.data.name}</>;
}
