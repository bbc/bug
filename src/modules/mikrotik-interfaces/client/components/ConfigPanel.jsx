import React from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

export default function ConfigPanel({ register, errors, config }) {
    return (
        <>
            <Grid item xs={12}>
                <TextField
                    inputProps={{ ...register("title") }}
                    variant="filled"
                    required
                    fullWidth
                    error={errors?.title ? true : false}
                    defaultValue={config?.title}
                    type="text"
                    label="Panel Title"
                />
            </Grid>

            <Grid item xs={12}>
                <TextField
                    inputProps={{ ...register("type") }}
                    variant="filled"
                    fullWidth
                    error={errors?.type ? true : false}
                    defaultValue={config?.type}
                    type="text"
                    label="Type"
                />
            </Grid>

            <Grid item xs={12}>
                <TextField
                    inputProps={{ ...register("description") }}
                    variant="filled"
                    fullWidth
                    error={errors?.description ? true : false}
                    defaultValue={config?.description}
                    type="text"
                    label="Description"
                />
            </Grid>

            <Grid item xs={12}>
                <TextField
                    inputProps={{ ...register("notes") }}
                    variant="filled"
                    fullWidth
                    error={errors?.notes ? true : false}
                    defaultValue={config?.notes}
                    type="text"
                    label="Notes"
                />
            </Grid>

            <Grid item xs={12}>
                <Button type="submit" variant="contained" color="default" size="large" disableElevation>
                    Save
                </Button>
            </Grid>
        </>
    );
}
