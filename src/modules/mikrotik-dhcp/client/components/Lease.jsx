import { useHistory } from "react-router-dom";
import React from "react";
import AxiosPut from "@utils/AxiosPut";
import { useAlert } from "@utils/Snackbar";
import BugForm from "@core/BugForm";
import ReadonlyTextField from "@core/ReadonlyTextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import AxiosGet from "@utils/AxiosGet";
import AxiosDelete from "@utils/AxiosDelete";
import Loading from "@components/Loading";
import useAsyncEffect from "use-async-effect";
import BugFormAutocomplete from "@core/BugFormAutocomplete";
import ConfigFormSwitch from "@core/ConfigFormSwitch";
import { useForm } from "react-hook-form";

const useStyles = makeStyles((theme) => ({
    form: {
        "& .MuiFormControl-root .MuiFormHelperText-root:not(.Mui-error)": {
            color: theme.palette.success.main,
        },
    },
    deleteButton: {
        backgroundColor: theme.palette.error.main,
        color: "#fff",
        "&:hover": {
            backgroundColor: theme.palette.error.hover,
        },
    },
}));

export default function Lease({ panelId, leaseId }) {
    const classes = useStyles();
    const history = useHistory();
    const [lease, setLease] = React.useState(null);
    const [servers, setServers] = React.useState(null);
    const [addressLists, setAddressLists] = React.useState(null);
    const sendAlert = useAlert();

    useAsyncEffect(async () => {
        setLease(await AxiosGet(`/container/${panelId}/lease/${leaseId}`));
    }, []);

    useAsyncEffect(async () => {
        setServers(await AxiosGet(`/container/${panelId}/server/`));
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

    const { register, handleSubmit, control, formState, setError, getValues, clearErrors } = useForm();

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
        return <Loading />;
    }

    return (
        <>
            <BugForm onClose={handleCancelClicked}>
                <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                    <BugForm.Header onClose={handleCancelClicked}>Edit DHCP Lease</BugForm.Header>
                    <BugForm.Body>
                        <Grid container spacing={4} className={classes.form}>
                            <Grid item xs={12}>
                                <TextField
                                    inputProps={{
                                        ...register("address", {
                                            required: true,
                                            pattern: /((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){4}/,
                                        }),
                                    }}
                                    required
                                    fullWidth
                                    error={errors.address}
                                    defaultValue={lease.address}
                                    type="text"
                                    label="Address"
                                />
                            </Grid>
                            {lease["host-name"] && (
                                <Grid item xs={12}>
                                    <ReadonlyTextField
                                        fullWidth
                                        defaultValue={lease["host-name"]}
                                        type="text"
                                        label="Hostname"
                                    />
                                </Grid>
                            )}
                            <Grid item xs={12}>
                                <TextField
                                    inputProps={{ ...register("comment") }}
                                    fullWidth
                                    error={errors.comment}
                                    defaultValue={lease.comment}
                                    type="text"
                                    label="Comment"
                                />
                            </Grid>
                            {addressLists && (
                                <Grid item xs={12}>
                                    <BugFormAutocomplete
                                        name="address-lists"
                                        label="Address Lists"
                                        control={control}
                                        defaultValue={lease["address-lists"]}
                                        error={errors["address-lists"]}
                                        fullWidth
                                        sort
                                        options={addressLists}

                                        // helperText="Only allow this security type from these addresses"
                                    />
                                </Grid>
                            )}
                            <Grid item xs={12}>
                                <TextField
                                    inputProps={{
                                        ...register("mac-address", {
                                            required: true,
                                            pattern: /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/,
                                        }),
                                    }}
                                    fullWidth
                                    error={errors["mac-address"]}
                                    defaultValue={lease["mac-address"]}
                                    type="text"
                                    label="MAC Address"
                                />
                            </Grid>
                            {lease["manufacturer"] && (
                                <Grid item xs={12}>
                                    <ReadonlyTextField
                                        fullWidth
                                        defaultValue={lease["manufacturer"]}
                                        type="text"
                                        label="Manufacturer"
                                    />
                                </Grid>
                            )}
                            <Grid item xs={12}>
                                <ReadonlyTextField
                                    fullWidth
                                    defaultValue={lease["status"]}
                                    type="text"
                                    label="Status"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <ConfigFormSwitch
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
                                    <BugFormAutocomplete
                                        name="address-lists"
                                        label="Address Lists"
                                        control={control}
                                        defaultValue={lease["address-lists"]}
                                        error={errors["address-lists"]}
                                        fullWidth
                                        sort
                                        options={addressLists}

                                        // helperText="Only allow this security type from these addresses"
                                    />
                                </Grid>
                            )}

                            {servers && lease && (
                                <Grid item xs={12}>
                                    <TextField
                                        select
                                        inputProps={{
                                            ...register("server"),
                                        }}
                                        fullWidth
                                        label="DHCP Server"
                                        defaultValue={lease.server}
                                        SelectProps={{
                                            native: true,
                                        }}
                                    >
                                        <option value={null}>all</option>
                                        {servers.map((server) => (
                                            <option value={server.name} key={server.id}>
                                                {server.name}
                                            </option>
                                        ))}
                                    </TextField>
                                </Grid>
                            )}
                        </Grid>
                    </BugForm.Body>
                    <BugForm.Actions>
                        <Button
                            variant="contained"
                            className={classes.deleteButton}
                            disableElevation
                            onClick={handleDeleteClicked}
                        >
                            Delete
                        </Button>
                        <div style={{ flexGrow: 1 }}></div>
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
