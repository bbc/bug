import BugLoading from "@core/BugLoading";
import BugNoData from "@core/BugNoData";
import { useApiPoller } from "@hooks/ApiPoller";
import { Grid } from "@mui/material";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import PowerChart from "../components/PowerChart";
import ReceiverStatus from "../components/ReceiverStatus";

export default function MainPanel() {
    const params = useParams();
    const panelConfig = useSelector((state) => state.panelConfig);

    const items = useApiPoller({
        url: `/container/${params.panelId}/receiver/status`,
        interval: 30000,
    });

    if (items.status === "loading" || items.status === "idle") {
        return <BugLoading />;
    }

    if (items.data.length <= 0) {
        return (
            <BugNoData
                panelId={params.panelId}
                title="No receiver data found. Check your receiver settings."
                showConfigButton={false}
            />
        );
    }

    return (
        <>
            <ReceiverStatus panelId={params.panelId} />
            <Grid container spacing={2}>
                <PowerChart receiverCount={panelConfig?.data?.receiverCount} panelId={params.panelId} />
            </Grid>
        </>
    );
}
