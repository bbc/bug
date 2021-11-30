import React from "react";
import BugPanelTabbedForm from "@core/BugPanelTabbedForm";
import InterfaceTabDetails from "./InterfaceTabDetails";
import InterfaceTabNeighbours from "./InterfaceTabNeighbours";
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
                labels={["Details", "Statistics", "Neighbour", "Devices"]}
                content={[
                    <InterfaceTabDetails panelId={panelId} interfaceId={interfaceId} />,
                    <InterfaceTabStatistics panelId={panelId} interfaceId={interfaceId} />,
                    <InterfaceTabNeighbours panelId={panelId} interfaceId={interfaceId} />,
                    <InterfaceTabDevices panelId={panelId} interfaceId={interfaceId} />,
                ]}
            ></BugPanelTabbedForm>
        </>
    );
}
