import React, { useEffect } from "react";
import Loading from "@components/Loading";
import DecoderCard from "./DecoderCard";
import { useApiPoller } from "@utils/ApiPoller";
import Grid from "@material-ui/core/Grid";
import io from "socket.io-client-2";
import { useSelector } from "react-redux";

let socket;

export default function Decoders({ panelId }) {
    const panelConfig = useSelector((state) => state.panelConfig);

    const decoders = useApiPoller({
        url: `/container/${panelId}/device/all/decoders`,
        interval: 2000,
    });

    const token = useApiPoller({
        url: `/container/${panelId}/system/token`,
        interval: 30000,
    });

    useEffect(() => {
        socket = io("https://io-core.teradek.com", {
            transports: ["websocket"],
            query: {
                cid: panelConfig?.data?.organisation,
                auth_token: token?.data?.auth_token,
            },
        });

        socket.on("connect_error", (event) => {
            console.log(event);
        });

        socket.on("connect", () => {
            console.log(`Conencted to Teradek Core ${socket.id}`);
        });

        return () => {
            socket.off("connect");
            socket.off("connect_error");
        };
    }, [token, panelConfig]);

    const renderCard = (decoder) => {
        return <DecoderCard socket={socket} key={decoder?.sid} {...decoder} />;
    };

    const renderCards = (decoders) => {
        if (decoders) {
            return decoders.map((decoder) => renderCard(decoder));
        }
    };

    if (decoders.status === "loading" || decoders.status === "idle") {
        return <Loading />;
    }

    return (
        <>
            <Grid container spacing={3}>
                {renderCards(decoders.data)}
            </Grid>
        </>
    );
}
