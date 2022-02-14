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

export default function PageSystemBackup() {
    const sendAlert = useAlert();
    const dispatch = useDispatch();
    const timeAgo = new TimeAgo("en-GB");

    const info = useApiPoller({
        url: `/api/system/info`,
        interval: 5000,
    });

    const getButton = () => {
        if (info.data?.updates.newVersion && !info.data.git.development) {
            return (
                <Button onClick={onUpdate} underline="none" variant="outlined" color="primary" disableElevation>
                    Update BUG
                </Button>
            );
        }

        return (
            <Button onClick={onCheckUpdate} underline="none" variant="outlined" color="primary" disableElevation>
                Check for Updates
            </Button>
        );
    };

    const onUpdate = async () => {
        const response = await AxiosGet(`/api/system/update`);

        if (response) {
            sendAlert(`Updating BUG to version ${info.data.updates.version}`, { broadcast: true, variant: "success" });
        } else {
            sendAlert(`Failed to apply BUG update. Please try again`, { variant: "error" });
        }
    };

    const onCheckUpdate = async () => {
        const response = await AxiosGet(`/api/system/updatecheck`);
        if (response?.newVersion) {
            sendAlert(`There's a new version of BUG avalible ${response.data.version}.`, { variant: "success" });
        }
        if (!response?.newVersion) {
            sendAlert(`You're using the latest version of BUG.`, { variant: "success" });
        }
        if (!response) {
            sendAlert(`Failed to check for system updates.`, { variant: "error" });
        }
    };

    const openWebpage = async (event, url) => {
        const newWindow = window.open(url, "_blank", "noopener,noreferrer");
        if (newWindow) newWindow.opener = null;
        event.stopPropagation();
        event.preventDefault();
    };

    useEffect(() => {
        dispatch(pageTitleSlice.actions.set("System Updates"));
    }, [dispatch]);

    if (info.status === "loading" || info.status === "idle") {
        return <BugLoading />;
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
                        items={[
                            {
                                name: "Current Version",
                                value: (
                                    <BugTableLinkButton
                                        onClick={(event) =>
                                            openWebpage(
                                                event,
                                                `https://github.com/${info.data?.git.repository}/releases/tag/v${info.data?.version}`
                                            )
                                        }
                                        color="secondary"
                                    >
                                        {info.data?.version}
                                    </BugTableLinkButton>
                                ),
                            },
                            {
                                name: "Available Version",
                                value: (
                                    <>
                                        {info.data.updates.newVersion ? (
                                            <BugTableLinkButton
                                                onClick={(event) =>
                                                    openWebpage(
                                                        event,
                                                        `https://github.com/${info.data?.git.repository}/releases/tag/v${info.data?.updates.version}`
                                                    )
                                                }
                                                color="secondary"
                                            >
                                                {info.data?.updates.version}
                                            </BugTableLinkButton>
                                        ) : (
                                            "BUG is up to date"
                                        )}
                                    </>
                                ),
                            },
                            {
                                name: "GitHub Commit Hash",
                                value: (
                                    <>
                                        {info.data.git.development ? (
                                            "Development Build"
                                        ) : (
                                            <BugTableLinkButton
                                                onClick={(event) =>
                                                    openWebpage(
                                                        event,
                                                        `https://github.com/${info.data?.git.repository}/commit/${info.data?.git.commit}`
                                                    )
                                                }
                                                color="secondary"
                                            >
                                                {info.data?.git.commit}
                                            </BugTableLinkButton>
                                        )}
                                    </>
                                ),
                            },
                            {
                                name: "Build Number",
                                value: (
                                    <>
                                        {info.data.git.development ? (
                                            "N/A"
                                        ) : (
                                            <BugTableLinkButton
                                                onClick={(event) =>
                                                    openWebpage(
                                                        event,
                                                        `https://github.com/${info.data?.git.repository}/actions/runs/${info.data?.git.buildId}`
                                                    )
                                                }
                                                color="secondary"
                                            >
                                                {info.data?.git.buildNumber}
                                            </BugTableLinkButton>
                                        )}
                                    </>
                                ),
                            },
                        ]}
                    />
                </Grid>

                <Grid item lg={6} xs={12}>
                    <BugDetailsCard
                        title="System Update"
                        width="12rem"
                        items={[
                            {
                                name: "Last Checked",
                                value: lastChecked,
                            },
                            {
                                name: "",
                                value: getButton(),
                            },
                        ]}
                    />
                </Grid>

                <Grid item lg={6} xs={12}>
                    <BugDetailsCard title="Changelogs" width="12rem" items={[]} />
                </Grid>
            </Grid>
        </>
    );
}
