import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import BugConfigFormTextField from "@core/BugConfigFormTextField";
import BugConfigFormPasswordTextField from "@core/BugConfigFormPasswordTextField";
import BugConfigFormAutocomplete from "@core/BugConfigFormAutocomplete";
import { useForm } from "react-hook-form";
import Grid from "@mui/material/Grid";
import { useApiPoller } from "@hooks/ApiPoller";
import BugLoading from "@core/BugLoading";

const DeviceDiaglog = ({ defaultData, onDismiss, onCreate, onEdit, panelId, deviceId, open, title = "Add Device" }) => {
    const [data, setDefault] = useState(defaultData);
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const groups = useApiPoller({
        url: `/container/${panelId}/groups`,
        interval: 30000,
    });

    useEffect(() => {
        setDefault(defaultData);
    }, [defaultData]);

    const onSubmit = (form) => {
        //If new host
        if (!deviceId) {
            onCreate(form);
        } else {
            onEdit(form, deviceId);
        }
        onDismiss();
    };

    const getActionText = () => {
        if (deviceId) {
            return "Edit Device";
        }
        return "Add Device";
    };

    if (groups.status === "loading" || groups.status === "idle") {
        return <BugLoading />;
    }

    return (
        <Dialog open={open} onClose={onDismiss} style={{ minWidth: "50%" }}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                            <BugConfigFormTextField
                                name="title"
                                control={control}
                                rules={{ required: true }}
                                fullWidth
                                error={errors.title}
                                defaultValue={data?.title}
                                label="Title"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <BugConfigFormTextField
                                name="location"
                                control={control}
                                rules={{ required: false }}
                                fullWidth
                                error={errors.location}
                                defaultValue={data?.location}
                                label="Location"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <BugConfigFormTextField
                                name="address"
                                control={control}
                                rules={{ required: true }}
                                fullWidth
                                error={errors.address}
                                defaultValue={data?.address}
                                label="Address"
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <BugConfigFormTextField
                                name="username"
                                control={control}
                                rules={{ required: false }}
                                fullWidth
                                error={errors.username}
                                defaultValue={data?.username}
                                label="Username"
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <BugConfigFormPasswordTextField
                                name="password"
                                control={control}
                                rules={{ required: false }}
                                fullWidth
                                error={errors?.password}
                                defaultValue={data?.password}
                                label="Password"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <BugConfigFormAutocomplete
                                name="groups"
                                label="Groups"
                                control={control}
                                defaultValue={data?.groups}
                                options={groups?.data}
                                error={errors?.groups}
                                freeSolo={true}
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button color="secondary" onClick={onDismiss}>
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

export default DeviceDiaglog;