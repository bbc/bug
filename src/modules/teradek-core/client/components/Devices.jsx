import React from "react";
import EncoderTable from "./encoders/EncoderTable";
import DecoderTable from "./decoders/DecoderTable";
import PanelTabbedForm from "@core/PanelTabbedForm";
import { useApiPoller } from "@utils/ApiPoller";

export default function Devices({ panelId, devices }) {
    const channels = useApiPoller({
        url: `/container/${panelId}/channel/all`,
        interval: 5000,
    });

    const decoders = devices.filter((device) => device?.type === "decoder");
    const encoders = devices.filter((device) => device?.type === "encoder");

    return (
        <>
            <PanelTabbedForm
                labels={["Encoders", "Decoders"]}
                content={[
                    <EncoderTable
                        panelId={panelId}
                        header={false}
                        encoders={encoders}
                        decoders={decoders}
                        channels={channels.data}
                    />,
                    <DecoderTable
                        panelId={panelId}
                        header={false}
                        encoders={encoders}
                        decoders={decoders}
                        channels={channels.data}
                    />,
                ]}
            ></PanelTabbedForm>
        </>
    );
}
