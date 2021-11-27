import React from "react";
import BugPanelTabbedForm from "@core/BugPanelTabbedForm";
import InterfaceTabDetails from "./InterfaceTabDetails";
// import InterfaceTabEthernet from "./InterfaceTabEthernet";
import InterfaceTabStatistics from "./InterfaceTabStatistics";
// import InterfaceTabHardware from "./InterfaceTabHardware";
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
                labels={["Details", "Statistics"]}
                content={[
                    <InterfaceTabDetails panelId={panelId} interfaceId={interfaceId} />,
                    <InterfaceTabStatistics panelId={panelId} interfaceId={interfaceId} />,
                    // <InterfaceTabEthernet panelId={panelId} interfaceName={interfaceName} />,
                    // <InterfaceTabHardware panelId={panelId} interfaceName={interfaceName} />,
                ]}
            ></BugPanelTabbedForm>
        </>
    );
}
