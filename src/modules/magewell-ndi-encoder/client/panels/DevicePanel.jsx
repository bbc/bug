import BugPanelTabbedForm from "@core/BugPanelTabbedForm";
import { Box } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import DeviceTab from "../components/DeviceTab";
import NetworkTab from "../components/NetworkTab";
export default function MainPanel() {
    const params = useParams();
    const navigate = useNavigate();

    const handleBackClicked = () => {
        navigate(`/panel/${params?.panelId}`);
    };

    return (
        <Box>
            <BugPanelTabbedForm
                onClose={handleBackClicked}
                labels={["Device", "Network"]}
                content={[
                    <DeviceTab deviceId={params.deviceId} panelId={params.panelId} header={false} />,
                    <NetworkTab deviceId={params.deviceId} panelId={params.panelId} header={false} />,
                ]}
                locations={[
                    `/panel/${params.panelId}/device/${params.deviceId}`,
                    `/panel/${params.panelId}/device/${params.deviceId}/network`,
                ]}
                defaultTab={0}
            ></BugPanelTabbedForm>
        </Box>
    );
}
