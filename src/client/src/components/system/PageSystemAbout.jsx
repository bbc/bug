import React, { useEffect } from "react";
import { useAlert } from "@utils/Snackbar";
import Grid from "@mui/material/Grid";
import { useDispatch } from "react-redux";
import pageTitleSlice from "@redux/pageTitleSlice";
import Button from "@mui/material/Button";
import AxiosGet from "@utils/AxiosGet";
import BugDetailsCard from "@core/BugDetailsCard";
import { useApiPoller } from "@hooks/ApiPoller";
import BugLoading from "@core/BugLoading";
import TimeAgo from "javascript-time-ago";
import BugTableLinkButton from "@core/BugTableLinkButton";
import BugRestrictTo from "@core/BugRestrictTo";

export default function PageSystemBackup() {
    const sendAlert = useAlert();
    const dispatch = useDispatch();
    const timeAgo = new TimeAgo("en-GB");

    const info = useApiPoller({
        url: `/api/system/info`,
        interval: 5000,
    });

    const openWebpage = async (event, url) => {
        if (!url.inlude("http")) {
            url = `http://${url}`;
        }
        const newWindow = window.open(url, "_blank", "noopener,noreferrer");
        if (newWindow) newWindow.opener = null;
        event.stopPropagation();
        event.preventDefault();
    };

    const bugIpAddressButton = () => {
        return (
            <BugTableLinkButton onClick={(event) => openWebpage(event, info.data.ip)} color="secondary">
                {info.data.ip}
            </BugTableLinkButton>
        );
    };

    const onShutdown = async () => {
        sendAlert(`System shutdown initiated`, { broadcast: "true", variant: "success" });
        AxiosGet("/api/bug/shutdown");
    };

    const onReboot = async () => {
        sendAlert(`System reboot initiated`, { broadcast: "true", variant: "success" });
        AxiosGet("/api/bug/reboot");
    };

    const onRefresh = async () => {
        window.location.reload();
    };

    useEffect(() => {
        dispatch(pageTitleSlice.actions.set("About BUG"));
    }, [dispatch]);

    if (info.status === "loading" || info.status === "idle") {
        return <BugLoading />;
    }

    return (
        <>
            <Grid container spacing={4}>
                <BugRestrictTo role="admin">
                    <Grid item lg={6} xs={12}>
                        <BugDetailsCard
                            title="Server Controls"
                            width="10rem"
                            items={[
                                {
                                    name: "Shutdown",
                                    value: (
                                        <Button
                                            onClick={onShutdown}
                                            underline="none"
                                            variant="outlined"
                                            color="primary"
                                            disableElevation
                                        >
                                            Shutdown
                                        </Button>
                                    ),
                                },
                                {
                                    name: "Reboot",
                                    value: (
                                        <Button
                                            onClick={onReboot}
                                            underline="none"
                                            variant="outlined"
                                            color="primary"
                                            disableElevation
                                        >
                                            Reboot
                                        </Button>
                                    ),
                                },
                                {
                                    name: "Refresh Page",
                                    value: (
                                        <Button
                                            onClick={onRefresh}
                                            underline="none"
                                            variant="outlined"
                                            color="primary"
                                            disableElevation
                                        >
                                            Refresh
                                        </Button>
                                    ),
                                },
                            ]}
                        />
                    </Grid>
                </BugRestrictTo>
                <Grid item lg={6} xs={12}>
                    <BugDetailsCard
                        title="Server Infomation"
                        width="10rem"
                        items={[
                            { name: "IP Address", value: bugIpAddressButton() },
                            { name: "Uptime", value: timeAgo.format(Date.now() - parseInt(info.data?.uptime) * 1000) },
                            { name: "Current Version", value: info.data.version },
                            {
                                name: "Update Needed",
                                value: info.data?.upToDate ? "Yes" : "Up to Date",
                            },
                        ]}
                    />
                </Grid>
            </Grid>
        </>
    );
}
