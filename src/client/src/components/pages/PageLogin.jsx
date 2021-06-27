import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAlert } from "@utils/Snackbar";
import { makeStyles } from "@material-ui/core/styles";
import BugQuote from "@components/BugQuote";
import axios from "axios";
import LoadingOverlay from "@components/LoadingOverlay";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import pageTitleSlice from "@redux/pageTitleSlice";
import userSlice from "@redux/userSlice";

import LocalLogin from "@components/login/LocalLogin";
import PinLogin from "@components/login/PinLogin";

const useStyles = makeStyles((theme) => ({
    login: {
        margin: theme.spacing(1),
    },
    quote: {
        margin: theme.spacing(1),
        color: theme.palette.primary.main,
        fontSize: "1.1rem",
    },
}));

export default function PageLogin() {
    const dispatch = useDispatch();
    const classes = useStyles();
    const history = useHistory();
    const sendAlert = useAlert();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        dispatch(pageTitleSlice.actions.set("Login"));
    }, [dispatch]);

    const handleLogin = async (form) => {
        setLoading(true);
        const response = await axios.post(`/api/login`, form);
        if (response?.data?.status === "success") {
            sendAlert(`${response?.data?.data?.name} has been logged in.`, {
                variant: "success",
            });
            history.push("/");
        } else {
            sendAlert("Could not login user.", {
                variant: "warning",
            });
        }
        dispatch(userSlice.actions[response.data.status](response.data));
        setLoading(false);
    };

    if (loading) {
        return <LoadingOverlay />;
    }

    return (
        <>
            <Grid
                container
                justify="center"
                direction="column"
                alignItems="center"
            >
                <Grid item xs={12} md={6} lg={6}>
                    <Card>
                        <CardHeader
                            className={classes.login}
                            title="Local Login"
                        ></CardHeader>
                        <CardContent>
                            <LocalLogin handleLogin={handleLogin} />
                        </CardContent>
                    </Card>
                </Grid>

                {/* <Grid item xs={12} md={6} lg={6}>
                    <Card className={classes.login}>
                        <CardHeader title="Pin Login"></CardHeader>
                        <CardContent>
                            <PinLogin handleLogin={handleLogin}/>
                        </CardContent>
                    </Card>
                </Grid> */}

                <Grid item xs={12}>
                    <Typography
                        variant="body2"
                        component="p"
                        className={classes.quote}
                    >
                        <BugQuote />
                    </Typography>
                </Grid>
            </Grid>
        </>
    );
}
