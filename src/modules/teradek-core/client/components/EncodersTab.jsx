import React, { useEffect } from "react";
import Loading from "@components/Loading";
import EncoderCard from "./EncoderCard";
import { useApiPoller } from "@utils/ApiPoller";
import Grid from "@material-ui/core/Grid";
import io from "socket.io-client-2";
import { useSelector } from "react-redux";

let socket;

export default function Encoders({ panelId }) {
    const panelConfig = useSelector((state) => state.panelConfig);

    const encoders = useApiPoller({
        url: `/container/${panelId}/device/all/encoders`,
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

    const renderCard = (encoder) => {
        return <EncoderCard socket={socket} key={encoder?.sid} {...encoder} />;
    };

    const renderCards = (encoders) => {
        if (encoders) {
            return encoders.map((encoder) => renderCard(encoder));
        }
    };

    if (encoders.status === "loading" || encoders.status === "idle") {
        return <Loading />;
    }

    return (
        <>
            <Grid container spacing={3}>
                {renderCards(encoders.data)}
            </Grid>
        </>
    );
}
