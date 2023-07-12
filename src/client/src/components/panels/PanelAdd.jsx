import { useHistory } from "react-router-dom";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import AxiosCommand from "@utils/AxiosCommand";
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
        const response = await AxiosCommand(`/api/panel`, form);
        if (response === null) {
            sendAlert(`${form?.title} could not be added.`, { variant: "warning" });
        } else {
            sendAlert(`${form?.title} has been added.`, { broadcast: "true", variant: "success" });
            history.goBack();
        }
        setLoading(false);
    };

    const handleCancel = () => {
        history.goBack();
    };

    const getModuleOptions = () => {
        const options = [];
        for (let module of moduleList) {
            options.push({
                id: module.name,
                label: module?.longname,
            });
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
                                    name="title"
                                    control={control}
                                    fullWidth
                                    error={errors?.title}
                                    rules={{ required: true }}
                                    label="Title"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <BugConfigFormTextField
                                    name="description"
                                    control={control}
                                    fullWidth
                                    error={errors?.description}
                                    label="Description"
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <BugConfigFormPanelGroup name="group" control={control} defaultValue="" />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <BugConfigFormSelect
                                    name="module"
                                    control={control}
                                    fullWidth
                                    error={errors?.module}
                                    defaultValue=""
                                    rules={{ required: true }}
                                    label="Module"
                                    options={getModuleOptions()}
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
