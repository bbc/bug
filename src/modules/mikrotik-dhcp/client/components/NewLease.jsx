import BugConfigFormAutocomplete from "@core/BugConfigFormAutocomplete";
import BugConfigFormSelect from "@core/BugConfigFormSelect";
import BugConfigFormSwitch from "@core/BugConfigFormSwitch";
import BugConfigFormTextField from "@core/BugConfigFormTextField";
import BugForm from "@core/BugForm";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import AxiosGet from "@utils/AxiosGet";
import AxiosPost from "@utils/AxiosPost";
import { useAlert } from "@utils/Snackbar";
import React from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import useAsyncEffect from "use-async-effect";

export default function Lease({ panelId, leaseId }) {
    const history = useHistory();
    const [servers, setServers] = React.useState(null);
    const [addressLists, setAddressLists] = React.useState(null);
    const sendAlert = useAlert();

    useAsyncEffect(async () => {
        const serverResult = await AxiosGet(`/container/${panelId}/server/`);
        const resultArray = [];
        for (let eachServer of serverResult) {
            resultArray.push({ id: eachServer.id, label: eachServer.name });
        }
        setServers(resultArray);
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
            sendAlert(`Lease has been updated.`, { broadcast: "true", variant: "success" });
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
                        <Grid
                            container
                            spacing={4}
                            sx={{
                                "& .MuiFormControl-root .MuiFormHelperText-root:not(.Mui-error)": {
                                    color: "success.main",
                                },
                            }}
                        >
                            <Grid item size={{ xs: 12 }}>
                                {servers && (
                                    <BugConfigFormSelect
                                        name="server"
                                        control={control}
                                        rules={{ required: true }}
                                        fullWidth
                                        error={errors.server}
                                        label="DHCP Server"
                                        options={servers}
                                    />
                                )}
                            </Grid>
                            <Grid item size={{ xs: 12 }}>
                                <BugConfigFormTextField
                                    name="address"
                                    control={control}
                                    rules={{ required: true }}
                                    fullWidth
                                    error={errors.address}
                                    label="Address"
                                />
                            </Grid>
                            <Grid item size={{ xs: 12 }}>
                                <BugConfigFormTextField
                                    name="comment"
                                    control={control}
                                    fullWidth
                                    error={errors.comment}
                                    label="Comment"
                                />
                            </Grid>
                            <Grid item size={{ xs: 12 }}>
                                <BugConfigFormTextField
                                    name="mac-address"
                                    control={control}
                                    rules={{ required: true }}
                                    fullWidth
                                    error={errors["mac-address"]}
                                    defaultValue="02:00:00:00:00:00"
                                    label="MAC Address"
                                />
                            </Grid>
                            <Grid item size={{ xs: 12 }}>
                                <BugConfigFormSwitch
                                    name="enabled"
                                    label="Enabled"
                                    control={control}
                                    defaultValue={true}
                                    fullWidth
                                />
                            </Grid>
                            {addressLists && (
                                <Grid item size={{ xs: 12 }}>
                                    <BugConfigFormAutocomplete
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
