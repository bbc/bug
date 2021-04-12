import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useForm } from "react-hook-form";
import AxiosPost from '@utils/AxiosPost';
import { useSnackbar } from 'notistack';
import { useHistory } from "react-router-dom";

import Loading from "@components/Loading";

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

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

export default function ConfigPanel(props) {
    const classes = useStyles();
    const history = useHistory();
    const [config, setConfig] = React.useState({ ...{loading: false}, ...props.config})
    const { enqueueSnackbar } = useSnackbar();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const updateConfig = async (newConfig) => {
        setConfig({...config, ...{loading: true} });
        const response = await AxiosPost(`/api/panel/config/${props.id}`);
        setConfig({...{loading: false}, ...response});
      }
    
    const onSubmit = async (form) => {
        const response = await updateConfig(form);
        if(!response?.error){  
            enqueueSnackbar(`${config?.panelName} has been updated.`, { variant: 'success'});
            history.goBack()
        }
        else{
            enqueueSnackbar(`${config?.panelName} could not be updated.`, { variant: 'warning'});
        }
    }

    const getContents = () => {
        let contents = (<Loading/>);
        if(!config.loading){
            contents = form;
        }
        return contents;
    }

    const form = (
        <Card className={classes.card} >
        <CardHeader
        title='Configuration'
        />

        <CardContent>
            <form onSubmit={ handleSubmit(onSubmit) } className={ classes.form } >
                <Grid container spacing={4} > 
                     <Grid item xs={12} >
                        <TextField
                            inputProps={{...register('title')}}
                            variant="outlined"
                            fullWidth
                            error={errors?.panelName ? true : false}
                            defaultValue={ config?.title }
                            className={ classes.feild }
                            type='text'
                            label="Panel Title"
                        />
                    </Grid>

                    <Grid item xs={12} >
                        <TextField
                            inputProps={{...register('type')}}
                            variant="outlined"
                            fullWidth
                            error={errors?.type ? true : false}
                            defaultValue={ config?.type }
                            className={ classes.feild }
                            type='text'
                            label="Type"
                        />
                    </Grid>

                    <Grid item xs={12} >
                        <TextField
                            inputProps={{...register('description')}}
                            variant="outlined"
                            fullWidth
                            error={errors?.description ? true : false}
                            defaultValue={ config?.description }
                            className={ classes.feild }
                            type='text'
                            label="Description"
                        />
                    </Grid>

                    <Grid item xs={12} >
                        <TextField
                            inputProps={{...register('notes')}}
                            variant="outlined"
                            fullWidth
                            error={errors?.notes ? true : false}
                            defaultValue={ config?.notes }
                            className={ classes.feild }
                            type='text'
                            label="Notes"
                        />
                    </Grid>

                    <Grid item xs={12} >
                        <Button type='submit' variant="contained" color="default" size='large' disableElevation>
                            Save
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </CardContent>
    </Card>
    ); 

    return (
        <React.Fragment>
            { getContents() }
        </React.Fragment>
    );
}