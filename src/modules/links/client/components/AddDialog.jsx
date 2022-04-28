import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import BugConfigFormTextField from "@core/BugConfigFormTextField";
import BugConfigFormSelect from "@core/BugConfigFormSelect";
import { useForm } from "react-hook-form";
import Grid from "@mui/material/Grid";
import AxiosPut from "@utils/AxiosPut";

const AddDialog = ({ defaultData, onDismiss, onCreate, onEdit, index, open, title = "New Link" }) => {
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
        //If new link
        if (!index) {
            onCreate(form);
        } else {
            onEdit(form, index);
        }
        onDismiss();
    };

    const getActionText = () => {
        if (index) {
            return "Edit Link";
        }
        return "Add Link";
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
                                rules={{ required: true }}
                                fullWidth
                                error={errors.description}
                                defaultValue={data?.description}
                                label="Description"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <BugConfigFormTextField
                                name="url"
                                control={control}
                                rules={{ required: true }}
                                fullWidth
                                error={errors.url}
                                defaultValue={data?.url}
                                label="URL"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <BugConfigFormSelect
                                name="behaviour"
                                control={control}
                                fullWidth
                                error={errors?.behaviour}
                                defaultValue={data?.behaviour}
                                label="Behaviour"
                                rules={{ required: true }}
                                options={[
                                    { id: "new", label: "Open link in new tab" },
                                    { id: "same", label: "Open link over this tab" },
                                    { id: "inside", label: "Open link within this tab" },
                                ]}
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
