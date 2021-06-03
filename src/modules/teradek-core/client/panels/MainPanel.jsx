import React from "react";
import EncodersTab from "../components/EncodersTab";
import DecodersTab from "../components/DecodersTab";
import SputniksTab from "../components/SputniksTab";
import ChannelsTab from "../components/ChannelsTab";
import PanelTabbedForm from "@core/PanelTabbedForm";
import { useParams } from "react-router-dom";

export default function MainPanel() {
    const params = useParams();

    return (
        <>
            <PanelTabbedForm
                labels={["Encoders", "Decoders", "Sputniks", "Channels"]}
                content={[
                    <EncodersTab panelId={params.panelId} />,
                    <DecodersTab panelId={params.panelId} />,
                    <SputniksTab panelId={params.panelId} />,
                    <ChannelsTab panelId={params.panelId} />,
                ]}
            ></PanelTabbedForm>
        </>
    );
}
