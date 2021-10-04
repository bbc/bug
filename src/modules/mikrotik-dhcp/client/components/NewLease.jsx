import { useHistory } from "react-router-dom";
import React from "react";
import { useAlert } from "@utils/Snackbar";
import BugForm from "@core/BugForm";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { makeStyles } from "@mui/styles";
import TextField from "@mui/material/TextField";
import AxiosGet from "@utils/AxiosGet";
import AxiosPost from "@utils/AxiosPost";
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
    const [servers, setServers] = React.useState(null);
    const [addressLists, setAddressLists] = React.useState(null);
    const sendAlert = useAlert();

    useAsyncEffect(async () => {
        setServers(await AxiosGet(`/container/${panelId}/server/`));
    }, []);

    useAsyncEffect(async () => {
        setAddressLists(await AxiosGet(`/container/${panelId}/addresslist/`));
    }, []);

    const handleCancelClicked = () => {
        history.goBack();
    };

    const { register, handleSubmit, control, formState, setError, getValues, clearErrors, setValue } = useForm();

    const getErrors = () => {
        const errors = {};

        for (const [field] of Object.entries(formState.errors)) {
            errors[field] = true;
        }

        return errors;
    };

    const errors = getErrors();

    const handleAddressChanged = (event) => {
        const macAddress = getValues("mac-address");
        if (macAddress.startsWith("02:00:00")) {
            // we can overwrite it
            const regex = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/;
            if (regex.test(event.target.value)) {
                // split to get the last two octets
                const ipArray = event.target.value.split(".");
                const thirdOctet = ipArray[2].padStart(3, "0");
                const fourthOctet = ipArray[3].padStart(3, "0");
                const newMac =
                    "02:00:00:" +
                    thirdOctet[0] +
                    thirdOctet[1] +
                    ":" +
                    thirdOctet[2] +
                    fourthOctet[0] +
                    ":" +
                    fourthOctet[1] +
                    fourthOctet[2];
                setValue("mac-address", newMac);
            }
        }
    };

    const onSubmit = async (form) => {
        const response = await AxiosPost(`/container/${panelId}/lease/add/`, form);
        if (response) {
            sendAlert(`Lease has been updated.`, { broadcast: true, variant: "success" });
            history.goBack();
        } else {
            sendAlert(`Lease could not be updated.`, { variant: "warning" });
        }
    };

    return (
        <>
            <BugForm onClose={handleCancelClicked}>
                <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                    <BugForm.Header onClose={handleCancelClicked}>Add DHCP Lease</BugForm.Header>
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
                                    type="text"
                                    label="Address"
                                    onChange={handleAddressChanged}
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    inputProps={{ ...register("comment") }}
                                    fullWidth
                                    error={errors.comment}
                                    type="text"
                                    label="Comment"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    inputProps={{
                                        ...register("mac-address", {
                                            required: true,
                                            pattern: /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/,
                                        }),
                                    }}
                                    fullWidth
                                    defaultValue="02:00:00:00:00:00"
                                    error={errors["mac-address"]}
                                    type="text"
                                    label="MAC Address"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <ConfigFormSwitch
                                    name="enabled"
                                    label="Enabled"
                                    control={control}
                                    defaultValue={true}
                                    fullWidth
                                />
                            </Grid>
                            {addressLists && (
                                <Grid item xs={12}>
                                    <BugFormAutocomplete
                                        name="address-lists"
                                        label="Address Lists"
                                        control={control}
                                        error={errors["address-lists"]}
                                        fullWidth
                                        sort
                                        options={addressLists}
                                        defaultValue={[]}
                                    />
                                </Grid>
                            )}

                            <Grid item xs={12}>
                                {servers && (
                                    <TextField
                                        select
                                        inputProps={{
                                            ...register("server"),
                                        }}
                                        fullWidth
                                        label="DHCP Server"
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
                                )}
                            </Grid>
                        </Grid>
                    </BugForm.Body>
                    <BugForm.Actions>
                        <Button variant="contained" color="secondary" disableElevation onClick={handleCancelClicked}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained" color="primary" disableElevation>
                            Add Lease
                        </Button>
                    </BugForm.Actions>
                </form>
            </BugForm>
        </>
    );
}
