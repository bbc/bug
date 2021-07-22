import React, { useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import { useDispatch } from "react-redux";
import pageTitleSlice from "@redux/pageTitleSlice";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";

const useStyles = makeStyles((theme) => ({
    card: {
        minWidth: 300,
        textAlign: "left",
        color: theme.palette.text.secondary,
        position: "relative",
        maxWidth: "70rem",
    },
}));

export default function PageSystemBackup() {
    const classes = useStyles();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(pageTitleSlice.actions.set("Backup & Restore"));
    }, [dispatch]);

    return (
        <>
            <Grid container spacing={4}>
                <Grid item lg={6} xs={12}>
                    <Card className={classes.card}>
                        <CardHeader component={Paper} square elevation={1} title="Backup" />
                        <CardContent>
                            You can download the entire configuration of this BUG as a single, compressed file.
                            <div style={{ marginTop: 16 }}>
                                <Button
                                    component={Link}
                                    href={`/api/system/backup`}
                                    download
                                    underline="none"
                                    variant="outlined"
                                    color="primary"
                                    disableElevation
                                >
                                    Download
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item lg={6} xs={12}>
                    <Card className={classes.card}>
                        <CardHeader component={Paper} square elevation={1} title="Restore" />
                        <CardContent>
                            Upload a backup file to restore a previous BUG configuration.
                            <div style={{ marginTop: 16 }}>
                                <form action="/api/system/restore" method="post" encType="multipart/form-data">
                                    <input type="file" name="backup" />
                                    <input type="submit" value="Upload" />
                                </form>
                            </div>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
}
