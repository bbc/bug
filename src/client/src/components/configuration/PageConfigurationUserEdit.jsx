import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import AxiosPost from "@utils/AxiosPost";
import { useDispatch } from "react-redux";
import pageTitleSlice from "@redux/pageTitleSlice";
import PanelForm from "@core/PanelForm";
import LoadingOverlay from "@components/LoadingOverlay";
import { useAlert } from "@utils/Snackbar";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import PanelGroupFormControl from "@core/PanelGroupFormControl";

export default function PageConfigurationUserEdit() {
    const params = useParams();
    const userId = params.userId ?? null;

    const [loading, setLoading] = useState(false);
    const sendAlert = useAlert();
    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({});

    const dispatch = useDispatch();

    useEffect(() => {
        // dispatch(pageTitleSlice.actions.set("Add Panel"));
    }, []);

    const onSubmit = async (form) => {
        setLoading(true);
        console.log(form);
        // const response = await AxiosPost(`/api/user`, form);
        // if (!response?.error) {
        //     sendAlert(`User ${form.username} has been added.`, { broadcast: true, variant: "success" });
        //     //TODO redirect
        // } else {
        //     sendAlert(`User ${form.username} could not be added.`, { variant: "warning" });
        // }
        setLoading(false);
    };

    const handleCancel = () => {
        //TODO redirect
    };

    const renderForm = () => (
        <>
            <PanelForm onClose={handleCancel}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <PanelForm.Header onClose={handleCancel}>Add a new user</PanelForm.Header>
                    <PanelForm.Body>
                        <Grid container spacing={4}>
                            <Grid item xs={12}>
                                <TextField
                                    inputProps={{ ...register("title", { required: true }) }}
                                    variant="filled"
                                    fullWidth
                                    error={errors?.title ? true : false}
                                    type="text"
                                    label="Title"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    inputProps={{ ...register("description") }}
                                    variant="filled"
                                    fullWidth
                                    error={errors?.description ? true : false}
                                    type="text"
                                    label="Description"
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <PanelGroupFormControl name="group" control={control} defaultValue="" />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormControl variant="filled" fullWidth>
                                    <InputLabel htmlFor="outlined-age-native-simple">Module</InputLabel>
                                    <Select
                                        native
                                        defaultValue=""
                                        error={errors?.module ? true : false}
                                        inputProps={{ ...register("module", { required: true }) }}
                                    ></Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </PanelForm.Body>
                    <PanelForm.Actions>
                        <Button variant="contained" color="secondary" disableElevation onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained" color="primary" disableElevation>
                            Add Panel
                        </Button>
                    </PanelForm.Actions>
                </form>
            </PanelForm>
        </>
    );

    return (
        <>
            {renderForm()}
            {loading && <LoadingOverlay />}
        </>
    );
}
