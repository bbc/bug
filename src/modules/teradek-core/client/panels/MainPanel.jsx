import React from "react";
import { useParams } from "react-router-dom";
import EncoderTable from "../components/EncoderTable";
import DecoderTable from "../components/DecoderTable";
import SputniksTable from "../components/SputniksTable";
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
                labels={["Encoders", "Decoders", "Sputniks"]}
                content={[
                    <EncoderTable panelId={params.panelId} header={false} />,
                    <DecoderTable panelId={params.panelId} header={false} />,
                    <SputniksTable panelId={params.panelId} header={false} />,
                ]}
                locations={[
                    `/panel/${params.panelId}/encoders`,
                    `/panel/${params.panelId}/decoders`,
                    `/panel/${params.panelId}/sputniks`,
                ]}
                defaultTab={0}
            ></BugPanelTabbedForm>
        </Box>
    );
}
