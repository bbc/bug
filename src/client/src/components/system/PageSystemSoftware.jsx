import React, { useEffect } from "react";
import { useAlert } from "@utils/Snackbar";
import Grid from "@mui/material/Grid";
import { useDispatch } from "react-redux";
import pageTitleSlice from "@redux/pageTitleSlice";
import Button from "@mui/material/Button";
import AxiosGet from "@utils/AxiosGet";
import BugDetailsCard from "@core/BugDetailsCard";
import { useApiPoller } from "@hooks/ApiPoller";
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

    const onCheckUpdate = async () => {
        const response = await AxiosGet(`/api/system/updatecheck`);
        if (response?.newVersion) {
            sendAlert(`There's a new version of BUG avalible ${response.data.version}.`, { variant: "success" });
        }
        if (!response?.newVersion) {
            sendAlert(`You're using the latest version of BUG.`, { variant: "success" });
        }
        if (!response) {
            sendAlert(`Failed to check for sysyem updates.`, { variant: "error" });
        }
    };

    useEffect(() => {
        dispatch(pageTitleSlice.actions.set("System Updates"));
    }, [dispatch]);

    if (info.status === "loading" || info.status === "idle") {
        return <Loading />;
    }

    const lastChecked = info.data?.updates.checkTime
        ? timeAgo.format(Date.parse(info.data?.updates.checkTime))
        : "Never";

    return (
        <>
            <Grid container spacing={4}>
                <Grid item lg={6} xs={12}>
                    <BugDetailsCard
                        title="System Version"
                        width="12rem"
                        data={[
                            {
                                name: "Current Version",
                                value: info.data?.version,
                            },
                            {
                                name: "Available Version",
                                value: info.data?.updates.version,
                            },
                        ]}
                    />
                </Grid>

                <Grid item lg={6} xs={12}>
                    <BugDetailsCard
                        title="System Update"
                        width="12rem"
                        data={[
                            {
                                name: "Last Checked",
                                value: lastChecked,
                            },
                            {
                                name: "",
                                value: (
                                    <>
                                        <Button
                                            onClick={onCheckUpdate}
                                            underline="none"
                                            variant="outlined"
                                            color="primary"
                                            disableElevation
                                        >
                                            Check for Updates
                                        </Button>
                                    </>
                                ),
                            },
                        ]}
                    />
                </Grid>
            </Grid>
        </>
    );
}
