import React, { useState, useEffect } from "react";
import { useAlert } from "@utils/Snackbar";
import Grid from "@mui/material/Grid";
import { useDispatch } from "react-redux";
import pageTitleSlice from "@redux/pageTitleSlice";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import AxiosGet from "@utils/AxiosGet";
import BugCard from "@core/BugCard";

export default function PageSystemBackup() {
    const sendAlert = useAlert();
    const dispatch = useDispatch();

    const onShutdown = async () => {
        sendAlert(`System shutdown initiated`, { broadcast: true, variant: "success" });
        AxiosGet("/api/bug/shutdown");
    };

    useEffect(() => {
        dispatch(pageTitleSlice.actions.set("About BUG"));
    }, [dispatch]);

    return (
        <>
            <Grid container spacing={4}>
                <Grid item lg={6} xs={12}>
                    <BugCard>
                        <CardHeader component={Paper} square elevation={1} title="Shutdown" />
                        <CardContent>
                            Shutdown BUG and all Modules.
                            <div style={{ marginTop: 16 }}>
                                <Button
                                    component={Link}
                                    onClick={onShutdown()}
                                    download
                                    underline="none"
                                    variant="outlined"
                                    color="primary"
                                    disableElevation
                                >
                                    Shutdown
                                </Button>
                            </div>
                        </CardContent>
                    </BugCard>
                </Grid>
            </Grid>
        </>
    );
}
