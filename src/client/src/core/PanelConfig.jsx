import { useHistory } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AxiosPut from "@utils/AxiosPut";
import { useDispatch } from "react-redux";
import pageTitleSlice from "../redux/pageTitleSlice";

import Loading from "@components/Loading";
import LoadingOverlay from "@components/LoadingOverlay";

import { useAlert } from "@utils/Snackbar";

import PanelForm from "@core/PanelForm";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

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
    pos: {
        marginBottom: 12,
    },
}));

export default function PanelConfig({ children, config, handleSubmit }) {
    const classes = useStyles();
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const { sendAlert } = useAlert();

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(pageTitleSlice.actions.set(config?.title || "Panel Configuration"));
    });

    const onCancel = () => {
        history.goBack();
    };

    const onSubmit = async (form) => {
        setLoading(true);
        const response = await AxiosPut(`/api/panel/config/${config?.id}`, form);
        if (!response?.error) {
            sendAlert(`${config?.title} has been updated.`, { broadcast:true, variant: "success" });
            history.goBack();
        } else {
            sendAlert(`${config?.title} could not be updated.`, { variant: "warning" });
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
                    <PanelForm onCancel={onCancel}>
                        <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
                            <PanelForm.Header>Configuration</PanelForm.Header>
                            <PanelForm.Body>
                                <Grid container spacing={4}>
                                    {children}
                                </Grid>
                            </PanelForm.Body>
                            <PanelForm.Actions>
                                <Button variant="contained" color="secondary" disableElevation onClick={onCancel}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="contained" color="primary" disableElevation>
                                    Save Changes
                                </Button>
                            </PanelForm.Actions>
                        </form>
                    </PanelForm>
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
