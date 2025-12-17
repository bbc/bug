import BugPanelTabbedForm from "@core/BugPanelTabbedForm";
import { useNavigate } from "react-router-dom";
import InterfaceTabDetails from "./InterfaceTabDetails";
import InterfaceTabDevices from "./InterfaceTabDevices";
import InterfaceTabNeighbors from "./InterfaceTabNeighbors";
import InterfaceTabStatistics from "./InterfaceTabStatistics";

export default function Interface({ panelId, interfaceId }) {
    const navigate = useNavigate();

    const handleBackClicked = () => {
        navigate(`/panel/${panelId}`);
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
