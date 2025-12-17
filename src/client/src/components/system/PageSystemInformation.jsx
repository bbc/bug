import BugDetailsCard from "@core/BugDetailsCard";
import BugLoading from "@core/BugLoading";
import { useApiPoller } from "@hooks/ApiPoller";
import { Grid } from "@mui/material";
import pageTitleSlice from "@redux/pageTitleSlice";
import TimeAgo from "javascript-time-ago";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function PageServerInformation() {
    const dispatch = useDispatch();
    const timeAgo = new TimeAgo("en-GB");

    const info = useApiPoller({
        url: `/api/system/info`,
        interval: 5000,
    });

    useEffect(() => {
        dispatch(pageTitleSlice.actions.set("System Information"));
    }, [dispatch]);

    if (info.status === "loading" || info.status === "idle") {
        return <BugLoading />;
    }

    return (
        <>
            <Grid
                container
                sx={{
                    justifyContent: "center",
                }}
            >
                <Grid size={{ xs: 12, lg: 8 }}>
                    <BugDetailsCard
                        title="System Infomation"
                        width="14rem"
                        items={[
                            { name: "IP Address", value: info.data.ip },
                            { name: "Uptime", value: timeAgo.format(Date.now() - parseInt(info.data?.uptime) * 1000) },
                            { name: "NPM Version", value: info.data.npmVersion },
                            { name: "Node Version", value: info.data.nodeVersion },
                            { name: "Docker Version", value: info.data.dockerVersion },
                            { name: "Docker OS", value: info.data.dockerOs },
                            { name: "Docker Kernel Version", value: info.data.kernelVersion },
                            { name: "Docker Architecture", value: info.data.architecture },
                            {
                                name: "Update Status",
                                value: info.data?.upToDate ? "Yes" : "Up to date",
                            },
                        ]}
                    />
                </Grid>
            </Grid>
        </>
    );
}
