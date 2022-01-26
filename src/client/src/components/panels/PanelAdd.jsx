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
import BugConfigFormPanelGroup from "@core/BugConfigFormPanelGroup";
import BugConfigFormTextField from "@core/BugConfigFormTextField";
import BugConfigFormSelect from "@core/BugConfigFormSelect";

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
        const options = {};
        for (let module of moduleList) {
            options[module.name] = module?.longname;
        }
        return options;
    };

    return (
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
                                <BugConfigFormSelect
                                    inputProps={{ ...register("module", { required: true }) }}
                                    fullWidth
                                    error={errors?.module ? true : false}
                                    defaultValue=""
                                    label="Module"
                                    items={getModuleOptions()}
                                />
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
            {loading && <LoadingOverlay />}
        </>
    );
}
