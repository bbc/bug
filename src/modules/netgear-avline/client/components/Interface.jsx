import React from "react";
import BugPanelTabbedForm from "@core/BugPanelTabbedForm";
import InterfaceTabDetails from "./InterfaceTabDetails";
import InterfaceTabNeighbors from "./InterfaceTabNeighbors";
import InterfaceTabStatistics from "./InterfaceTabStatistics";
import InterfaceTabDevices from "./InterfaceTabDevices";
import { useHistory } from "react-router-dom";

export default function Interface({ panelId, interfaceId }) {
    const history = useHistory();

    const handleBackClicked = () => {
        history.push(`/panel/${panelId}`);
    };

    return (
        <>
            <BugPanelTabbedForm
                onClose={handleBackClicked}
                labels={["Details", "Statistics", "Neighbor", "Devices"]}
                locations={[
                    `/panel/${panelId}/interface/${interfaceId}/details`,
                    `/panel/${panelId}/interface/${interfaceId}/statistics`,
                    `/panel/${panelId}/interface/${interfaceId}/neighbor`,
                    `/panel/${panelId}/interface/${interfaceId}/devices`,
                ]}
                content={[
                    <InterfaceTabDetails panelId={panelId} interfaceId={interfaceId} />,
                    <InterfaceTabStatistics panelId={panelId} interfaceId={interfaceId} />,
                    <InterfaceTabNeighbors panelId={panelId} interfaceId={interfaceId} />,
                    <InterfaceTabDevices panelId={panelId} interfaceId={interfaceId} />,
                ]}
            ></BugPanelTabbedForm>
        </>
    );
}
