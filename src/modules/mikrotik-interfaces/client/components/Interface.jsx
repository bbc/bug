import React from "react";
import BugPanelTabbedForm from "@core/BugPanelTabbedForm";
import InterfaceTabDetails from "./InterfaceTabDetails";
import InterfaceTabEthernet from "./InterfaceTabEthernet";
import InterfaceTabStatistics from "./InterfaceTabStatistics";
import InterfaceTabHardware from "./InterfaceTabHardware";
import InterfaceTabNeighbors from "./InterfaceTabNeighbors";
import { useHistory } from "react-router-dom";

export default function Interface({ panelId, interfaceName }) {
    const history = useHistory();

    const handleBackClicked = () => {
        history.push(`/panel/${panelId}`);
    };

    return (
        <>
            <BugPanelTabbedForm
                onClose={handleBackClicked}
                labels={["Details", "Ethernet", "Statistics", "Neighbors", "Hardware"]}
                locations={[
                    `/panel/${panelId}/interface/${interfaceName}/details`,
                    `/panel/${panelId}/interface/${interfaceName}/ethernet`,
                    `/panel/${panelId}/interface/${interfaceName}/statistics`,
                    `/panel/${panelId}/interface/${interfaceName}/neighbors`,
                    `/panel/${panelId}/interface/${interfaceName}/hardware`,
                ]}
                content={[
                    <InterfaceTabDetails panelId={panelId} interfaceName={interfaceName} />,
                    <InterfaceTabEthernet panelId={panelId} interfaceName={interfaceName} />,
                    <InterfaceTabStatistics panelId={panelId} interfaceName={interfaceName} />,
                    <InterfaceTabNeighbors panelId={panelId} interfaceName={interfaceName} />,
                    <InterfaceTabHardware panelId={panelId} interfaceName={interfaceName} />,
                ]}
            ></BugPanelTabbedForm>
        </>
    );
}
