import BugPanelTabbedForm from "@core/BugPanelTabbedForm";
import { useNavigate } from "react-router-dom";
import InterfaceTabDetails from "./InterfaceTabDetails";
import InterfaceTabEthernet from "./InterfaceTabEthernet";
import InterfaceTabHardware from "./InterfaceTabHardware";
import InterfaceTabNeighbors from "./InterfaceTabNeighbors";
import InterfaceTabStatistics from "./InterfaceTabStatistics";

export default function Interface({ panelId, interfaceName }) {
    const navigate = useNavigate();

    const handleBackClicked = () => {
        navigate(`/panel/${panelId}`);
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
