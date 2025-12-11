import BugDetailsCard from "@core/BugDetailsCard";
import BugLoading from "@core/BugLoading";
import BugTableLinkButton from "@core/BugTableLinkButton";
import { useApiPoller } from "@hooks/ApiPoller";
import Grid from "@mui/material/Grid";
import pageTitleSlice from "@redux/pageTitleSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function PageSystemBackup() {
    const dispatch = useDispatch();

    const info = useApiPoller({
        url: `/api/system/info`,
        interval: 3000,
    });

    const openWebpage = async (event, url) => {
        const newWindow = window.open(url, "_blank", "noopener,noreferrer");
        if (newWindow) newWindow.opener = null;
        event.stopPropagation();
        event.preventDefault();
    };

    useEffect(() => {
        dispatch(pageTitleSlice.actions.set("System Software"));
    }, [dispatch]);

    if (info.status === "idle") {
        return <BugLoading />;
    }

    return (
        <>
            <Grid
                container
                spacing={1}
                sx={{
                    justifyContent: "center",
                }}
            >
                <Grid item size={{ xs: 12, lg: 8 }}>
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
                                            "Development Build"
                                        ) : (
                                            <BugTableLinkButton
                                                onClick={(event) =>
                                                    openWebpage(
                                                        event,
                                                        `${info.data?.git.repository}/releases/tag/v${info.data?.npmVersion}`
                                                    )
                                                }
                                                sx={{ color: "text.secondary" }}
                                            >
                                                {info.data?.npmVersion}
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
                                            "Development Build"
                                        ) : (
                                            <>
                                                {info.data?.updates?.newVersion ? (
                                                    <BugTableLinkButton
                                                        onClick={(event) =>
                                                            openWebpage(
                                                                event,
                                                                `${info.data?.git.repository}/releases/tag/v${info.data?.updates?.version}`
                                                            )
                                                        }
                                                        sx={{ color: "text.secondary" }}
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
                                            "Development Build"
                                        ) : (
                                            <BugTableLinkButton
                                                onClick={(event) =>
                                                    openWebpage(
                                                        event,
                                                        `${info.data?.git.repository}/commit/${info.data?.git.commit}`
                                                    )
                                                }
                                                sx={{ color: "text.secondary" }}
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
                                            "Development Build"
                                        ) : (
                                            <BugTableLinkButton
                                                onClick={(event) =>
                                                    openWebpage(
                                                        event,
                                                        `${info.data?.git.repository}/actions/runs/${info.data?.git.buildId}`
                                                    )
                                                }
                                                sx={{ color: "text.secondary" }}
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
            </Grid>
        </>
    );
}
