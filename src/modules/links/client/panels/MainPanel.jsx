import React from "react";
import { useParams } from "react-router-dom";
import BugLoading from "@core/BugLoading";
import LinkCard from "./../components/LinkCard";
import Grid from "@mui/material/Grid";
import { useSelector } from "react-redux";

export default function MainPanel() {
    const params = useParams();
    const panelConfig = useSelector((state) => state.panelConfig);

    const getLinkCards = (links) => {
        const cards = [];
        for (let index in links) {
            cards.push(
                <>
                    <Grid item lg={6} xs={12}>
                        <LinkCard {...{ ...{ index: index }, ...links[index] }} />
                    </Grid>
                </>
            );
        }
        return cards;
    };

    if (panelConfig.status === "loading") {
        return <BugLoading />;
    }

    if (panelConfig.status !== "success") {
        return null;
    }

    return (
        <>
            <Grid container spacing={2}>
                {getLinkCards(panelConfig.data.links)}
            </Grid>
        </>
    );
}
