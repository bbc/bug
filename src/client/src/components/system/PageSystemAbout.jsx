import React, { useEffect } from "react";
import { useAlert } from "@utils/Snackbar";
import Grid from "@mui/material/Grid";
import { useDispatch } from "react-redux";
import pageTitleSlice from "@redux/pageTitleSlice";
import Button from "@mui/material/Button";
import AxiosGet from "@utils/AxiosGet";
import BugDetailsCard from "@core/BugDetailsCard";
import { useApiPoller } from "@utils/ApiPoller";
import Loading from "@components/Loading";
import TimeAgo from "javascript-time-ago";

export default function PageSystemBackup() {
    const sendAlert = useAlert();
    const dispatch = useDispatch();
    const timeAgo = new TimeAgo("en-GB");

    const info = useApiPoller({
        url: `/api/system/info`,
        interval: 5000,
    });

    const onShutdown = async () => {
        sendAlert(`System shutdown initiated`, { broadcast: true, variant: "success" });
        AxiosGet("/api/bug/shutdown");
    };

    const onReboot = async () => {
        sendAlert(`System reboot initiated`, { broadcast: true, variant: "success" });
        AxiosGet("/api/bug/reboot");
    };

    const getData = () => {
        const dataArray = [];
        for (let key in info.data) {
            if (key === "uptime") {
                info.data[key] = timeAgo.format(Date.now() - parseInt(info.data[key]) * 1000);
            }
            dataArray.push({
                name: key,
                value: <>{info.data[key]}</>,
            });
        }
        return dataArray;
    };

    useEffect(() => {
        dispatch(pageTitleSlice.actions.set("About BUG"));
    }, [dispatch]);

    if (info.status === "loading" || info.status === "idle") {
        return <Loading />;
    }

    return (
        <>
            <Grid container spacing={4}>
                <Grid item lg={6} xs={12}>
                    <BugDetailsCard
                        title="Server Controls"
                        width="10rem"
                        data={[
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
                        ]}
                    />
                </Grid>

                <Grid item lg={6} xs={12}>
                    <BugDetailsCard title="Server Infomation" width="10rem" data={getData()} />
                </Grid>
            </Grid>
        </>
    );
}
