import React from "react";
import EncoderTable from "./encoders/EncoderTable";
import DecoderTable from "./decoders/DecoderTable";

export default function EncodersTab({ panelId, devices }) {
    // const channels = useApiPoller({
    //     url: `/container/${panelId}/channel/all`,
    //     interval: 5000,
    // });

    const decoders = devices.filter((device) => device?.type === "decoder");
    const encoders = devices.filter((device) => device?.type === "encoder");

    return (
        <>
            <EncoderTable encoders={encoders} decoders={decoders} />
            <DecoderTable encoders={encoders} decoders={decoders} />
        </>
    );
}
