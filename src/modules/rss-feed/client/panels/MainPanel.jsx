import React from "react";
import { useParams } from "react-router-dom";
import { useApiPoller } from "@hooks/ApiPoller";
import BugLoading from "@core/BugLoading";
import FeedCard from "./../components/FeedCard";
import Masonry from "@mui/lab/Masonry";

export default function MainPanel() {
    const params = useParams();

    const items = useApiPoller({
        url: `/container/${params.panelId}/feed/items`,
        interval: 60000,
    });

    const getCards = (items) => {
        const cards = [];
        for (let item of items) {
            cards.push(<FeedCard key={item._id} item={item} />);
        }
        return cards;
    };

    if (items.status === "loading" || items.status === "idle") {
        return <BugLoading />;
    }

    return (
        <>
            <Masonry columns={2} spacing={1}>
                {getCards(items.data)}
            </Masonry>
        </>
    );
}
