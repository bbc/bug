import { useHistory } from "react-router-dom";
import React, { Suspense, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useForm } from "react-hook-form";
import AxiosPost from "@utils/AxiosPost";
import { useDispatch } from "react-redux";
import pageTitleSlice from "../redux/pageTitleSlice";
import AxiosGet from "@utils/AxiosGet";
import useAsyncEffect from 'use-async-effect';

import Loading from "@components/Loading";
import LoadingOverlay from "@components/LoadingOverlay";

import { useAlert } from "@utils/Snackbar";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
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
    const [moduleList, setModuleList] = useState([]);
    const sendAlert = useAlert();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const dispatch = useDispatch();

    useAsyncEffect(async () => {
        dispatch(pageTitleSlice.actions.set("Add Panel"));
        setModuleList(await AxiosGet(`/api/module`));
    }, []);

    const onSubmit = async (form) => {
        setLoading(true);
        const response = await AxiosPost(`/api/panel`,form);
        if (!response?.error) {
            sendAlert(`${form?.title} has been added.`, { broadcast:true, variant: "success" });
            history.goBack();
        } else {
            sendAlert(`${form?.title} could not be added.`, { variant: "warning" });
        }
        setLoading(false);
    };

    const getModuleOptions = () => {
        const modules = [
            <option key={`_select`} value={null}>Select ...</option>
        ];
        for(let module of moduleList){
            modules.push(<option key={module.name} value={module?.name}>{ module?.longname }</option>)
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

                                <Grid item xs={12} md={6} >
                                    <FormControl variant="outlined" fullWidth>
                                        <InputLabel htmlFor="outlined-age-native-simple">Module</InputLabel>
                                        <Select
                                            native
                                            error={errors?.module ? true : false}
                                            inputProps={{...register('module', { required: true } )}}
                                        >   
                                            { getModuleOptions() }
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