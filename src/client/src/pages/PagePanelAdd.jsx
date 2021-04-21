import { useHistory } from "react-router-dom";
import React, { Suspense, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useForm } from "react-hook-form";
import AxiosPost from "@utils/AxiosPost";
import { useDispatch } from "react-redux";
import pageTitleSlice from "../redux/pageTitleSlice";

import Loading from "@components/Loading";
import LoadingOverlay from "@components/LoadingOverlay";

import { useSnackbar } from "notistack";
import { useSelector } from 'react-redux'

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Grid from "@material-ui/core/Grid";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    form: {
        "& .MuiTextField-root": {
            minWidth: 275,
        },
    },
    card: {
        minWidth: 300,
        padding: theme.spacing(2),
        textAlign: "left",
        color: theme.palette.text.secondary,
    }
}));

export default function PageHome(props) {
    const classes = useStyles();
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const dispatch = useDispatch();
    const moduleList = useSelector(state => state.moduleList);

    useEffect(() => {
        dispatch(pageTitleSlice.actions.set("Add Panel"));
    });

    const onSubmit = async (form) => {
        setLoading(true);
        const response = await AxiosPost(`/api/panel`,form);
        if (!response?.error) {
            enqueueSnackbar(`${form?.title} has been added.`, { variant: "success" });
            history.goBack();
        } else {
            enqueueSnackbar(`${form?.title} could not be added.`, { variant: "warning" });
        }
        setLoading(false);
    };

    const getModules = () => {
        const modules = [];
        for(let module of moduleList?.data){
            modules.push(<option value={module?.name}>{ module?.longname }</option>)
        }
        return modules
    };

    const getLoading = () => {
        if (loading) {
            return <LoadingOverlay />;
        }
    };

    const renderForm = () => (
        <>
            <Suspense fallback={<Loading />}>
                <Card className={classes.card}>
                    <CardHeader title={`Panel`} />
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
                            <Grid container spacing={4}>

                                <Grid item xs={12} >
                                    <TextField
                                        inputProps={{...register('title')}}
                                        variant="outlined"
                                        fullWidth
                                        error={errors?.title ? true : false}
                                        type='text'
                                        label="Title"
                                    />
                                </Grid>

                                <Grid item xs={12} >
                                    <TextField
                                        inputProps={{...register('description')}}
                                        variant="outlined"
                                        fullWidth
                                        error={errors?.description ? true : false}
                                        type='text'
                                        label="Description"
                                    />
                                </Grid>

                                <Grid item xs={6} >
                                    <FormControl variant="outlined" fullWidth>
                                        <InputLabel htmlFor="outlined-age-native-simple">Module</InputLabel>
                                        <Select
                                            native
                                            label="Forecast Length"
                                            error={errors?.module ? true : false}
                                            inputProps={{...register('module', { required: true } )}}
                                        >   
                                            { getModules() }
                                        </Select>
                                    </FormControl>
                                </Grid>


                                <Grid item xs={12} >
                                    <Button type='submit' variant="contained" color="default" size='large' disableElevation>
                                        Add
                                    </Button>
                                </Grid>
                                
                            </Grid>
                        </form>
                    </CardContent>
                </Card>
            </Suspense>
        </>
    );

    return (
        <>
            {renderForm()}
            {getLoading()}
        </>
    );
}