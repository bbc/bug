import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import BugConfigFormTextField from "@core/BugConfigFormTextField";
import { useForm } from "react-hook-form";
import Grid from "@mui/material/Grid";

const ChannelDiaglog = ({ defaultData, onDismiss, onCreate, onEdit, channelId, open, title = "Add Channel" }) => {
    const [data, setDefault] = useState(defaultData);
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        setDefault(defaultData);
    }, [defaultData]);

    const onSubmit = (form) => {
        //If new host
        if (!channelId) {
            onCreate(form);
        } else {
            onEdit(form, channelId);
        }
        onDismiss();
    };

    const getActionText = () => {
        if (channelId) {
            return "Edit Channel";
        }
        return "Add Channel";
    };
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
                                name="number"
                                control={control}
                                rules={{ required: true }}
                                fullWidth
                                error={errors.number}
                                defaultValue={data?.number}
                                type="number"
                                label="Number"
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
                        <Grid item xs={12}>
                            <BugConfigFormTextField
                                name="port"
                                control={control}
                                rules={{ required: true }}
                                fullWidth
                                error={errors.port}
                                type="number"
                                defaultValue={data?.port}
                                label="Port"
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

export default ChannelDiaglog;
