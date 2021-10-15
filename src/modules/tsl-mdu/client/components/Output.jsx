import React from "react";
import { useHistory } from "react-router-dom";
import Loading from "@components/Loading";
import { useApiPoller } from "@utils/ApiPoller";
import BugPanelTabbedForm from "@core/BugPanelTabbedForm";
import OutputTabDetails from "./OutputTabDetails";
import OutputTabHistory from "./OutputTabHistory";

export default function Output({ panelId, outputNumber }) {
    const history = useHistory();

    const handleBackClicked = () => {
        history.push(`/panel/${panelId}`);
    };

    const output = useApiPoller({
        url: `/container/${panelId}/output/${outputNumber}`,
        interval: 2000,
    });

    const system = useApiPoller({
        url: `/container/${panelId}/system/latest`,
        interval: 2000,
    });

    console.log(system);

    if (output.status === "idle" || output.status === "loading") {
        return <Loading height="30vh" />;
    }
    if (output.status === "success" && !output.data) {
        return <>Output does not exist </>;
    }

    return (
        <>
            <BugPanelTabbedForm
                onClose={handleBackClicked}
                labels={["Details", "History"]}
                content={[
                    <OutputTabDetails output={output.data} panelId={panelId} />,
                    <OutputTabHistory output={output.data} panelId={panelId} />,
                ]}
            ></BugPanelTabbedForm>
        </>
    );
}
