import { useHistory } from "react-router-dom";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import AxiosPost from "@utils/AxiosPost";
import { useDispatch } from "react-redux";
import pageTitleSlice from "../redux/pageTitleSlice";
import AxiosGet from "@utils/AxiosGet";
import useAsyncEffect from "use-async-effect";
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

export default function PanelsAdd(props) {
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [moduleList, setModuleList] = useState([]);
    const sendAlert = useAlert();
    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({});

    const dispatch = useDispatch();

    useAsyncEffect(async () => {
        dispatch(pageTitleSlice.actions.set("Add Panel"));
        setModuleList(await AxiosGet(`/api/module`));
    }, []);

    const onSubmit = async (form) => {
        setLoading(true);
        const response = await AxiosPost(`/api/panel`, form);
        if (!response?.error) {
            sendAlert(`${form?.title} has been added.`, { broadcast: true, variant: "success" });
            history.goBack();
        } else {
            sendAlert(`${form?.title} could not be added.`, { variant: "warning" });
        }
        setLoading(false);
    };

    const handleCancel = () => {
        history.goBack();
    };

    const getModuleOptions = () => {
        const modules = [<option key={`_select`} value="" disabled></option>];
        for (let module of moduleList) {
            modules.push(
                <option key={module.name} value={module?.name}>
                    {module?.longname}
                </option>
            );
        }
        return modules;
    };

    const getLoading = () => {
        if (loading) {
            return <LoadingOverlay />;
        }
    };

    const renderForm = () => (
        <>
            <PanelForm onClose={handleCancel}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <PanelForm.Header onClose={handleCancel}>Add a new panel</PanelForm.Header>
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
                                    >
                                        {getModuleOptions()}
                                    </Select>
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
            {getLoading()}
        </>
    );
}
