import BugLoading from "@core/BugLoading";
import BugNoData from "@core/BugNoData";
import { useApiPoller } from "@hooks/ApiPoller";
import { Grid } from "@mui/material";
import { useParams } from "react-router-dom";
import HostCard from "./../components/HostCard";

export default function MainPanel() {
    const params = useParams();
    const hosts = useApiPoller({
        url: `/container/${params?.panelId}/hosts/`,
        interval: 3000,
    });

    const getHostCards = (hosts) => {
        const cards = [];
        for (let host of hosts) {
            cards.push(
                <Grid key={host?.hostId} size={{ xl: 3, lg: 4, md: 6, xs: 12 }}>
                    <HostCard panelId={params?.panelId} {...host} />
                </Grid>
            );
        }
        return cards;
    };

    if (hosts.status === "loading" || hosts.status === "idle") {
        return <BugLoading />;
    }

    if (hosts.status !== "success") {
        return (
            <BugNoData
                panelId={params?.panelId}
                title="No hosts found. Try adding some to monitor."
                showConfigButton={false}
            />
        );
    }

    return (
        <>
            <Grid alignItems="stretch" container spacing={1}>
                {getHostCards(hosts.data)}
            </Grid>
        </>
    );
}
