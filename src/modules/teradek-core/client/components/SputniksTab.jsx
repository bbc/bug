import React, { useEffect } from "react";
import Loading from "@components/Loading";
import SputnikCard from "./SputnikCard";
import { useApiPoller } from "@utils/ApiPoller";
import Grid from "@material-ui/core/Grid";
import io from "socket.io-client-2";
import { useSelector } from "react-redux";

let socket;

export default function Sputniks({ panelId }) {
    const panelConfig = useSelector((state) => state.panelConfig);

    const sputniks = useApiPoller({
        url: `/container/${panelId}/sputnik/all`,
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

    const renderCard = (sputnik) => {
        return (
            <SputnikCard
                socket={socket}
                key={sputnik?.identifier}
                {...sputnik}
            />
        );
    };

    const renderCards = (sputniks) => {
        if (sputniks) {
            return sputniks.map((sputnik) => renderCard(sputnik));
        }
    };

    if (sputniks.status === "loading" || sputniks.status === "idle") {
        return <Loading />;
    }

    return (
        <>
            <Grid container spacing={3}>
                {renderCards(sputniks.data)}
            </Grid>
        </>
    );
}
