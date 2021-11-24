import React from "react";
import { useParams } from "react-router-dom";
import DeviceTab from "./../components/DeviceTab";
import NetworkTab from "./../components/NetworkTab";
import BugPanelTabbedForm from "@core/BugPanelTabbedForm";
import Box from "@mui/material/Box";

export default function MainPanel() {
    const params = useParams();

    return (
        <Box
            sx={{
                "& .tabSpacer": {
                    height: "60px",
                },
            }}
        >
            <BugPanelTabbedForm
                className={classes.form}
                labels={["Device", "Network"]}
                content={[
                    <DeviceTab panelId={params.panelId} header={false} />,
                    <NetworkTab panelId={params.panelId} header={false} />,
                ]}
                locations={[`/panel/${params.panelId}/device`, `/panel/${params.panelId}/network`]}
                defaultTab={0}
            ></BugPanelTabbedForm>
        </Box>
    );
}
