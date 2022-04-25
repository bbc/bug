import React from "react";
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

const AddDialog = ({ links = [], panelId, defaultData, onDismiss, open, title = "New Link" }) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const updateLinks = async (newLinks) => {
        const response = await AxiosPut(`/api/panelconfig/${panelId}`, { links: newLinks });
        console.log(response);
    };
    const onSubmit = (form) => {
        //If new link
        if (!defaultData) {
            let newLinks = Object.assign([], links);
            newLinks.push(form);
            updateLinks(newLinks);
        }
        onDismiss();
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
                                defaultValue={defaultData?.title}
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
                                defaultValue={defaultData?.description}
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
                                defaultValue={defaultData?.url}
                                label="URL"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <BugConfigFormSelect
                                name="behaviour"
                                control={control}
                                fullWidth
                                error={errors?.behaviour}
                                defaultValue={defaultData?.behaviour}
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
                        Add Link
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default AddDialog;
