import { useHistory } from "react-router-dom";
import React from "react";
import AxiosPut from "@utils/AxiosPut";
import { useAlert } from "@utils/Snackbar";
import BugForm from "@core/BugForm";
import BugTextField from "@core/BugTextField";
import Grid from "@mui/material/Grid";
import BugConfigFormDeleteButton from "@core/BugConfigFormDeleteButton";
import Button from "@mui/material/Button";
import BugConfigFormTextField from "@core/BugConfigFormTextField";
import BugConfigFormSelect from "@core/BugConfigFormSelect";
import AxiosGet from "@utils/AxiosGet";
import AxiosDelete from "@utils/AxiosDelete";
import BugLoading from "@core/BugLoading";
import useAsyncEffect from "use-async-effect";
import BugConfigFormAutocomplete from "@core/BugConfigFormAutocomplete";
import BugConfigFormSwitch from "@core/BugConfigFormSwitch";
import { useForm } from "react-hook-form";

export default function Lease({ panelId, leaseId }) {
    const history = useHistory();
    const [lease, setLease] = React.useState(null);
    const [servers, setServers] = React.useState(null);
    const [addressLists, setAddressLists] = React.useState(null);
    const sendAlert = useAlert();

    useAsyncEffect(async () => {
        setLease(await AxiosGet(`/container/${panelId}/lease/${leaseId}`));
    }, []);

    useAsyncEffect(async () => {
        const serverResult = await AxiosGet(`/container/${panelId}/server/`);
        const resultArray = {};
        for (let eachServer of serverResult) {
            resultArray[eachServer.id] = eachServer.name;
        }
        setServers(resultArray);
    }, []);

    useAsyncEffect(async () => {
        setAddressLists(await AxiosGet(`/container/${panelId}/addresslist/`));
    }, []);

    const handleDeleteClicked = async () => {
        const response = await AxiosDelete(`/container/${panelId}/lease/${leaseId}`);
        if (response) {
            sendAlert(`Lease has been deleted.`, { broadcast: true, variant: "success" });
            history.goBack();
        } else {
            sendAlert(`Lease could not be deleted.`, { variant: "warning" });
        }
    };

    const handleCancelClicked = () => {
        history.goBack();
    };

    const { handleSubmit, control, formState } = useForm();

    const getErrors = () => {
        const errors = {};

        for (const [field] of Object.entries(formState.errors)) {
            errors[field] = true;
        }

        return errors;
    };

    const errors = getErrors();

    const onSubmit = async (form) => {
        const response = await AxiosPut(`/container/${panelId}/lease/${leaseId}`, form);
        if (response) {
            sendAlert(`Lease has been updated.`, { broadcast: true, variant: "success" });
            history.goBack();
        } else {
            sendAlert(`Lease could not be updated.`, { variant: "warning" });
        }
    };

    if (lease === null) {
        return <BugLoading />;
    }

    return (
        <>
            <BugForm onClose={handleCancelClicked}>
                <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                    <BugForm.Header onClose={handleCancelClicked}>Edit DHCP Lease</BugForm.Header>
                    <BugForm.Body>
                        <Grid
                            container
                            spacing={4}
                            sx={{
                                "& .MuiFormControl-root .MuiFormHelperText-root:not(.Mui-error)": {
                                    color: "success.main",
                                },
                            }}
                        >
                            <Grid item xs={12}>
                                <BugConfigFormTextField
                                    name="address"
                                    control={control}
                                    rules={{ required: true }}
                                    fullWidth
                                    error={errors.address}
                                    defaultValue={lease.address}
                                    label="Address"
                                />
                            </Grid>
                            {lease["host-name"] && (
                                <Grid item xs={12}>
                                    <BugTextField
                                        disabled
                                        fullWidth
                                        defaultValue={lease["host-name"]}
                                        type="text"
                                        label="Hostname"
                                        variant="standard"
                                    />
                                </Grid>
                            )}
                            <Grid item xs={12}>
                                <BugConfigFormTextField
                                    name="comment"
                                    control={control}
                                    fullWidth
                                    error={errors.comment}
                                    defaultValue={lease.comment}
                                    label="Comment"
                                />
                            </Grid>
                            {addressLists && (
                                <Grid item xs={12}>
                                    <BugConfigFormAutocomplete
                                        name="address-lists"
                                        label="Address Lists"
                                        control={control}
                                        defaultValue={lease["address-lists"]}
                                        error={errors["address-lists"]}
                                        fullWidth
                                        sort
                                        options={addressLists}
                                    />
                                </Grid>
                            )}
                            <Grid item xs={12}>
                                <BugConfigFormTextField
                                    name="mac-address"
                                    control={control}
                                    rules={{ required: true }}
                                    fullWidth
                                    error={errors["mac-address"]}
                                    defaultValue={lease["mac-address"]}
                                    label="MAC Address"
                                />
                            </Grid>
                            {lease["manufacturer"] && (
                                <Grid item xs={12}>
                                    <BugTextField
                                        disabled
                                        fullWidth
                                        defaultValue={lease["manufacturer"]}
                                        type="text"
                                        label="Manufacturer"
                                        variant="standard"
                                    />
                                </Grid>
                            )}
                            <Grid item xs={12}>
                                <BugTextField
                                    disabled
                                    fullWidth
                                    defaultValue={lease["status"]}
                                    type="text"
                                    label="Status"
                                    variant="standard"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <BugConfigFormSwitch
                                    name="enabled"
                                    label="Enabled"
                                    control={control}
                                    defaultValue={!lease.disabled}
                                    fullWidth
                                    helperText="Disabling the lease will not have an effect until the device next requests it"
                                />
                            </Grid>
                            {addressLists && (
                                <Grid item xs={12}>
                                    <BugConfigFormAutocomplete
                                        name="address-lists"
                                        label="Address Lists"
                                        control={control}
                                        defaultValue={lease["address-lists"]}
                                        error={errors["address-lists"]}
                                        fullWidth
                                        sort
                                        options={addressLists}
                                    />
                                </Grid>
                            )}

                            {servers && lease && (
                                <Grid item xs={12}>
                                    <BugConfigFormSelect
                                        name="server"
                                        control={control}
                                        fullWidth
                                        label="DHCP Server"
                                        defaultValue={lease.server}
                                        items={servers}
                                    />
                                </Grid>
                            )}
                        </Grid>
                    </BugForm.Body>
                    <BugForm.Actions>
                        <BugConfigFormDeleteButton onClick={handleDeleteClicked} />
                        <Button variant="contained" color="secondary" disableElevation onClick={handleCancelClicked}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained" color="primary" disableElevation>
                            Save
                        </Button>
                    </BugForm.Actions>
                </form>
            </BugForm>
        </>
    );
}
