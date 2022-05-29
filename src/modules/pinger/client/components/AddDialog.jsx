import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import BugConfigFormTextField from "@core/BugConfigFormTextField";
import { useForm } from "react-hook-form";
import Grid from "@mui/material/Grid";

const AddDialog = ({ defaultData, onDismiss, onCreate, onEdit, hostId, open, title = "New Host" }) => {
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
        if (!hostId) {
            onCreate(form);
        } else {
            onEdit(form, hostId);
        }
        onDismiss();
    };

    const getActionText = () => {
        if (hostId) {
            return "Edit Host";
        }
        return "Add Host";
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
                                name="description"
                                control={control}
                                rules={{ required: false }}
                                fullWidth
                                error={errors.description}
                                defaultValue={data?.description}
                                label="Description"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <BugConfigFormTextField
                                name="host"
                                control={control}
                                rules={{ required: true }}
                                fullWidth
                                error={errors.host}
                                defaultValue={data?.host}
                                label="Host"
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

export default AddDialog;
