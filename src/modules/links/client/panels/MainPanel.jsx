import BugLoading from "@core/BugLoading";
import { Grid } from "@mui/material";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import LinkCard from "./../components/LinkCard";

export default function MainPanel() {
    const params = useParams();
    const panelConfig = useSelector((state) => state.panelConfig);

    const getLinkCards = (links) => {
        const cards = [];
        for (let index in links) {
            cards.push(
                <Grid key={index} size={{ lg: 6, xs: 12 }}>
                    <LinkCard {...{ ...{ index: index }, ...links[index] }} />
                </Grid>
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
            <Grid container spacing={0}>
                {getLinkCards(panelConfig.data.links)}
            </Grid>
        </>
    );
}
