import { useHistory } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AxiosPut from "@utils/AxiosPut";
import { useDispatch } from "react-redux";
import pageTitleSlice from "../redux/pageTitleSlice";

import Loading from "@components/Loading";
import LoadingOverlay from "@components/LoadingOverlay";

import { useSnackbar } from "notistack";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    form: {
        "& .MuiTextField-root": {
            minWidth: 275,
        },
    },
    feild: {
        width: "100%",
    },
    link: {
        textDecoration: "none",
    },
    card: {
        minWidth: 300,
        padding: theme.spacing(2),
        textAlign: "left",
        color: theme.palette.text.secondary,
    },
    pos: {
        marginBottom: 12,
    },
}));

export default function PanelConfig({children, handleSubmit, config}) {
    const classes = useStyles();
    const history = useHistory();

    const [loading, setLoading] = useState(false);

    const { enqueueSnackbar } = useSnackbar();

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(pageTitleSlice.actions.set(config?.title || 'Panel Configuration' ));
    });

    const onSubmit = async (form) => {
        setLoading(true);
        const response = await AxiosPut(`/api/panel/config/${config?.id}`,form);
        if (!response?.error) {
            enqueueSnackbar(`${config?.title} has been updated.`, { variant: "success" });
            history.goBack();
        } else {
            enqueueSnackbar(`${config?.title} could not be updated.`, { variant: "warning" });
        }
        setLoading(false);
    };

    const getLoading = () => {
        if (loading) {
            return <LoadingOverlay />;
        }
    };

    const renderPanel = () => {
        let panel = <Loading />;
        if (config) {
            panel = (
                <>
                    <Card className={classes.card}>
                        <CardHeader title={`Configuration`} />
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
                                <Grid container spacing={4}>
                                    { children }
                                </Grid>
                            </form>
                        </CardContent>
                    </Card>
                </>
            );
        }
        return panel;
    };

    return (
        <div key={config?.id}>
            {renderPanel()}
            {getLoading()}
        </div>
    );
}
