import React, { useEffect, useState } from "react";
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
import CircularProgress from "@mui/material/CircularProgress";

export default function PageSystemBackup() {
    const sendAlert = useAlert();
    const dispatch = useDispatch();
    const [updating, setUpdating] = useState(false);
    const timeAgo = new TimeAgo("en-GB");

    const info = useApiPoller({
        url: `/api/system/info`,
        interval: 3000,
    });

    const getButton = () => {
        if (updating) {
            return (
                <Button
                    startIcon={<CircularProgress size={25} />}
                    onClick={onCancelUpdate}
                    underline="none"
                    variant="outlined"
                    color="primary"
                    disableElevation
                >
                    Updating...
                </Button>
            );
        }

        if (info.data?.updates?.newVersion && !info.data.git.development) {
            return (
                <Button
                    onClick={onUpdate}
                    underline="none"
                    variant="outlined"
                    color="primary"
                    disableElevation
                    disabled={info.data.git.development}
                >
                    Update BUG
                </Button>
            );
        }

        return (
            <Button
                onClick={onCheckUpdate}
                underline="none"
                variant="outlined"
                color="primary"
                disableElevation
                disabled={info.data.git.development}
            >
                Check for Updates
            </Button>
        );
    };

    const onCancelUpdate = () => {
        setUpdating(false);
    };

    const onUpdate = async () => {
        setUpdating(true);
        const response = await AxiosGet(`/api/system/update`);

        if (response.updating) {
            sendAlert(`Updating BUG to version ${info.data?.updates?.version}`, {
                broadcast: "true",
                variant: "success",
            });
        } else {
            sendAlert(`Failed to apply BUG update.}`, {
                variant: "error",
            });
            setUpdating(false);
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

    if (info.status === "idle") {
        return <BugLoading />;
    }

    const lastChecked = info.data?.updates?.checkTime
        ? timeAgo.format(Date.parse(info.data?.updates?.checkTime))
        : "Never";

    return (
        <>
            <Grid container spacing={1}>
                <Grid item lg={6} xs={12}>
                    <BugDetailsCard
                        sx={{
                            marginBottom: 0,
                        }}
                        title="Application Information"
                        width="12rem"
                        items={[
                            {
                                name: "Current Version",
                                value: (
                                    <>
                                        {info.data.git.development ? (
                                            "N/A - development build"
                                        ) : (
                                            <BugTableLinkButton
                                                onClick={(event) =>
                                                    openWebpage(
                                                        event,
                                                        `https://github.com/${info.data?.git.repository}/releases/tag/v${info.data?.version}`
                                                    )
                                                }
                                                color="text.secondary"
                                            >
                                                {info.data?.version}
                                            </BugTableLinkButton>
                                        )}
                                    </>
                                ),
                            },
                            {
                                name: "Available Version",
                                value: (
                                    <>
                                        {info.data.git.development ? (
                                            "N/A - development build"
                                        ) : (
                                            <>
                                                {info.data?.updates?.newVersion ? (
                                                    <BugTableLinkButton
                                                        onClick={(event) =>
                                                            openWebpage(
                                                                event,
                                                                `https://github.com/${info.data?.git.repository}/releases/tag/v${info.data?.updates?.version}`
                                                            )
                                                        }
                                                        color="secondary"
                                                    >
                                                        {info.data?.updates?.version}
                                                    </BugTableLinkButton>
                                                ) : (
                                                    "BUG is up to date"
                                                )}
                                            </>
                                        )}
                                    </>
                                ),
                            },
                            {
                                name: "GitHub Commit Hash",
                                value: (
                                    <>
                                        {info.data.git.development ? (
                                            "N/A - development build"
                                        ) : (
                                            <BugTableLinkButton
                                                onClick={(event) =>
                                                    openWebpage(
                                                        event,
                                                        `https://github.com/${info.data?.git.repository}/commit/${info.data?.git.commit}`
                                                    )
                                                }
                                                color="text.secondary"
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
                                            "N/A - development build"
                                        ) : (
                                            <BugTableLinkButton
                                                onClick={(event) =>
                                                    openWebpage(
                                                        event,
                                                        `https://github.com/${info.data?.git.repository}/actions/runs/${info.data?.git.buildId}`
                                                    )
                                                }
                                                color="text.secondary"
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
                        title="Application Upgrades"
                        width="12rem"
                        sx={{
                            marginBottom: 0,
                        }}
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
                    <BugDetailsCard
                        title="Developer Information"
                        width="12rem"
                        sx={{
                            marginBottom: 0,
                        }}
                        items={[
                            {
                                name: "Documentation",
                                value: (
                                    <BugTableLinkButton
                                        onClick={(event) => openWebpage(event, `https://bbc.github.io/bug`)}
                                        color="text.secondary"
                                    >
                                        bug.bbc.pages.github.io
                                    </BugTableLinkButton>
                                ),
                            },
                            {
                                name: "API Documentation",
                                value: (
                                    <BugTableLinkButton
                                        onClick={(event) => openWebpage(event, `/documentation`)}
                                        color="text.secondary"
                                    >
                                        /documentation
                                    </BugTableLinkButton>
                                ),
                            },
                        ]}
                    />
                </Grid>
            </Grid>
        </>
    );
}
