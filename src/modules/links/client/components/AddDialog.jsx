import BugConfigFormSelect from "@core/BugConfigFormSelect";
import BugConfigFormTextField from "@core/BugConfigFormTextField";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from "@mui/material";
import { useForm } from "react-hook-form";

const AddDialog = ({ defaultData, onDismiss, onCreate, onEdit, index, open, title = "New Link" }) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (form) => {
        //If new link
        if (index === null || index === undefined) {
            onCreate(form);
        } else {
            onEdit(form, index);
        }
        onDismiss();
    };

    const getActionText = () => {
        if (index !== null && index !== undefined) {
            return "Save";
        }
        return "Add";
    };

    // console.log(data);
    return (
        <Dialog open={open} onClose={onDismiss} style={{ minWidth: "50%" }}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={4}>
                        <Grid size={{ xs: 12 }}>
                            <BugConfigFormTextField
                                name="title"
                                control={control}
                                rules={{ required: true }}
                                fullWidth
                                error={errors.title}
                                defaultValue={defaultData?.title ?? ""}
                                label="Title"
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <BugConfigFormTextField
                                name="description"
                                control={control}
                                rules={{ required: true }}
                                fullWidth
                                error={errors.description}
                                defaultValue={defaultData?.description ?? ""}
                                label="Description"
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <BugConfigFormTextField
                                name="url"
                                control={control}
                                rules={{ required: true }}
                                fullWidth
                                error={errors.url}
                                defaultValue={defaultData?.url ?? ""}
                                label="URL"
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <BugConfigFormSelect
                                name="behaviour"
                                control={control}
                                fullWidth
                                error={errors?.behaviour}
                                defaultValue={defaultData?.behaviour ?? "new"}
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
