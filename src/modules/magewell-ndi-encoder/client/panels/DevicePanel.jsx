import React from "react";
import { useParams } from "react-router-dom";
import DeviceTab from "../components/DeviceTab";
import NetworkTab from "../components/NetworkTab";
import BugPanelTabbedForm from "@core/BugPanelTabbedForm";
import Box from "@mui/material/Box";
import { useHistory } from "react-router-dom";

export default function MainPanel() {
    const params = useParams();
    const history = useHistory();

    const handleBackClicked = () => {
        history.push(`/panel/${params?.panelId}`);
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
