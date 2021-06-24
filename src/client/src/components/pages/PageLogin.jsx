import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import BugQuote from "@components/BugQuote";
import LocalLogin from "@components/login/LocalLogin";
import PinLogin from "@components/login/PinLogin";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { useDispatch } from "react-redux";
import pageTitleSlice from "@redux/pageTitleSlice";

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
    const classes = useStyles();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(pageTitleSlice.actions.set("Login"));
    }, [dispatch]);

    return (
        <>
            <Grid container justify="center" direction="column" alignItems="center">
                <Grid item xs={12} md={6} lg={6}>
                    <Card>
                        <CardHeader className={classes.login} title="Local Login"></CardHeader>
                        <CardContent>
                            <LocalLogin />
                        </CardContent>
                    </Card>
                </Grid>

                {/* <Grid item xs={12} md={6} lg={6}>
                    <Card className={classes.login}>
                        <CardHeader title="Pin Login"></CardHeader>
                        <CardContent>
                            <PinLogin />
                        </CardContent>
                    </Card>
                </Grid> */}

                <Grid item xs={12}>
                    <Typography variant="body2" component="p" className={classes.quote}>
                        <BugQuote />
                    </Typography>
                </Grid>
            </Grid>
        </>
    );
}
