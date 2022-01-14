import { useHistory } from "react-router-dom";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import AxiosPost from "@utils/AxiosPost";
import { useDispatch } from "react-redux";
import pageTitleSlice from "@redux/pageTitleSlice";
import AxiosGet from "@utils/AxiosGet";
import useAsyncEffect from "use-async-effect";
import BugForm from "@core/BugForm";
import LoadingOverlay from "@components/LoadingOverlay";
import { useAlert } from "@utils/Snackbar";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import BugConfigFormPanelGroup from "@core/BugConfigFormPanelGroup";
import BugConfigFormTextField from "@core/BugConfigFormTextField";

export default function PanelAdd(props) {
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
        if (moduleList && Array.isArray(moduleList)) {
            for (let module of moduleList) {
                modules.push(
                    <option key={module.name} value={module?.name}>
                        {module?.longname}
                    </option>
                );
            }
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
            <BugForm onClose={handleCancel}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <BugForm.Header onClose={handleCancel}>Add a new panel</BugForm.Header>
                    <BugForm.Body>
                        <Grid container spacing={4}>
                            <Grid item xs={12}>
                                <BugConfigFormTextField
                                    inputProps={{ ...register("title", { required: true }) }}
                                    fullWidth
                                    error={errors?.title ? true : false}
                                    type="text"
                                    label="Title"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <BugConfigFormTextField
                                    inputProps={{ ...register("description") }}
                                    fullWidth
                                    error={errors?.description ? true : false}
                                    type="text"
                                    label="Description"
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <BugConfigFormPanelGroup name="group" control={control} defaultValue="" />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="outlined-age-native-simple">Module</InputLabel>
                                    <Select
                                        native
                                        defaultValue=""
                                        variant="standard"
                                        error={errors?.module ? true : false}
                                        inputProps={{ ...register("module", { required: true }) }}
                                    >
                                        {getModuleOptions()}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </BugForm.Body>
                    <BugForm.Actions>
                        <Button variant="contained" color="secondary" disableElevation onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained" color="primary" disableElevation>
                            Add Panel
                        </Button>
                    </BugForm.Actions>
                </form>
            </BugForm>
        </>
    );

    return (
        <>
            {renderForm()}
            {getLoading()}
        </>
    );
}
