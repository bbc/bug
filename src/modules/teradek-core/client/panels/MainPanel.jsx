import React from "react";
import EncodersTab from "../components/EncodersTab";
import DecodersTab from "../components/DecodersTab";
import PanelTabbedForm from "@core/PanelTabbedForm";
import { useParams } from "react-router-dom";

export default function MainPanel() {
    const params = useParams();

    return (
        <>
            <PanelTabbedForm
                labels={["Encoders", "Decoders"]}
                content={[
                    <EncodersTab panelId={params.panelId} />,
                    <DecodersTab panelId={params.panelId} />,
                ]}
            ></PanelTabbedForm>
        </>
    );
}
