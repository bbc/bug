import { useParams, useHistory } from "react-router-dom";
import React, { Suspense, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useForm } from "react-hook-form";
import useAsyncEffect from 'use-async-effect';
import AxiosGet from "@utils/AxiosGet";
import AxiosPost from '@utils/AxiosPost';

import Loading from "@components/Loading";
import LoadingOverlay from "@components/LoadingOverlay";
import PageTitle from '@components/PageTitle';

import { useSnackbar } from 'notistack';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    form: {
      '& .MuiTextField-root': {
        minWidth: 275,
      },
    },
    feild: {
      width: '100%',
    },
    link: {
      textDecoration: 'none',
    },
    card: {
      minWidth: 300,
      padding: theme.spacing(2),
      textAlign: 'left',
      color: theme.palette.text.secondary,
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    }
  }));

export default function PageHome(props) {
    const params = useParams();
    const panelId = params.panelid ?? "";
    const classes = useStyles();
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [config, setConfig] = useState(null);
    const { enqueueSnackbar } = useSnackbar();
    const { register, handleSubmit, formState: { errors } } = useForm();

    useAsyncEffect(async () => {
        setConfig(await AxiosGet(`/api/panel/config/${panelId}`));
    }, [panelId]);

    
    const onSubmit = async (form) => {
        setLoading(true);
        console.log(form);
        const response = await AxiosPost(`/api/panel/config/${panelId}`);
        if(!response?.error){  
            setConfig(response);
            enqueueSnackbar(`${config?.title} has been updated.`, { variant: 'success'});
            history.goBack()
        }
        else{
            enqueueSnackbar(`${config?.title} could not be updated.`, { variant: 'warning'});
        }
        setLoading(false);
    }

    const getLoading = () => {
        if(loading){
            return (<LoadingOverlay/>)
        }
    }

    const renderPanel = () => {
        let panel = (<Loading/>);
        if (config) {
            const ImportedPanel = React.lazy(() => import(`@modules/${config?.module}/client/components/SettingsPanel`).catch(() => console.log('Error in importing')));
            panel = (
                <React.Fragment>
                    <Suspense fallback={<Loading/>}>
                        <PageTitle>{ 'Settings | '+config?.title }</PageTitle>

                        <Card className={classes.card} >
                            <CardHeader
                            title={`Configuration`}
                            />
                            <CardContent>
                                <form onSubmit={ handleSubmit(onSubmit) } className={ classes.form } >
                                    <Grid container spacing={4} > 
                                        <ImportedPanel register={ register } config={ config } errors={ errors }/>
                                    </Grid>
                                </form>
                            </CardContent>
                        </Card>

                    </Suspense>
                </React.Fragment>
            );
        }
        return panel;
    };

    return (
        <div key={panelId}>
            { renderPanel() }
            { getLoading() }
        </div>
    );
}
