import React, { useEffect } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import { useDispatch } from "react-redux";
import pageTitleSlice from "@redux/pageTitleSlice";

const useStyles = makeStyles((theme) => ({
    card: {
        minWidth: 300,
        textAlign: "left",
        color: theme.palette.text.secondary,
        position: "relative",
        maxWidth: "70rem",
    },
}));

export default function PageSystemConfiguration() {
    const classes = useStyles();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(pageTitleSlice.actions.set("System Configuration"));
    }, [dispatch]);

    return (
        <>
            <Card className={classes.card}>
                <CardHeader component={Paper} square elevation={1} title="System Backup" />
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
        </>
    );
}
