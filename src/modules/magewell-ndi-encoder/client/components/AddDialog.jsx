import BugConfigFormPasswordTextField from "@core/BugConfigFormPasswordTextField";
import BugConfigFormTextField from "@core/BugConfigFormTextField";
import { useConfigFormHandler } from "@hooks/ConfigFormHandler";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from "@mui/material";
import AxiosPost from "@utils/AxiosPost";
import AxiosPut from "@utils/AxiosPut";
import { useAlert } from "@utils/Snackbar";
import { useEffect, useState } from "react";

const AddDialog = ({ panelId, deviceId = null, defaultData, dialogOpen, open, title = "Add New Encoder" }) => {
    const [data, setDefault] = useState(defaultData);
    const sendAlert = useAlert();

    const { register, handleSubmit, control, errors, reset, validateServer, messages } = useConfigFormHandler({
        panelId: panelId,
    });

    const closeDialog = async () => {
        await setDefault(null);
        await reset(null);
        dialogOpen(false);
    };
    useEffect(() => {
        if (deviceId) {
            setDefault(defaultData);
        } else {
            setDefault(null);
            reset(null);
        }
    }, [defaultData, deviceId, open]);

    const onSubmit = async (form) => {
        //If new link
        if (!deviceId) {
            if (await AxiosPost(`/container/${panelId}/device`, form)) {
                sendAlert(`Added Magewell Encoder at ${form.address}.`, { broadcast: "true", variant: "success" });
            } else {
                sendAlert(`Failed to add magewell encoder at ${form.address}`, { variant: "error" });
            }
        } else {
            if (await AxiosPut(`/container/${panelId}/device/${deviceId}`, form)) {
                sendAlert(`Updated Magewell Encoder at ${form.address}.`, { broadcast: "true", variant: "success" });
            } else {
                sendAlert(`Failed to update magewell encoder at ${form.address}`, { variant: "error" });
            }
        }

        closeDialog();
    };

    const getActionText = () => {
        if (deviceId) {
            return "Edit";
        }
        return "Add";
    };
    return (
        <Dialog open={open} onClose={closeDialog} style={{ minWidth: "50%" }}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={4}>
                        <Grid size={{ xs: 12, md: 12 }}>
                            <BugConfigFormTextField
                                name="address"
                                control={control}
                                rules={{ required: true }}
                                fullWidth
                                error={errors.address}
                                defaultValue={data?.address}
                                supportsValidation
                                helperText={messages.address}
                                onChange={(event) => validateServer(event, "address", ["address"])}
                                label="IP Address"
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <BugConfigFormTextField
                                name="username"
                                control={control}
                                rules={{ required: true }}
                                fullWidth
                                error={errors.username}
                                helperText={messages.username}
                                defaultValue={data?.username}
                                label="Username"
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <BugConfigFormPasswordTextField
                                name="password"
                                control={control}
                                rules={{ required: true }}
                                fullWidth
                                helperText={messages.username}
                                error={errors?.password}
                                defaultValue={data?.password}
                                label="Password"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button color="secondary" onClick={closeDialog}>
                        Cancel
                    </Button>
                    <Button color="primary" type="submit">
                        {getActionText()}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default AddDialog;
