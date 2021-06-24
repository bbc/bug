import React from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

export default function ConfigPanel({ register, errors, config }) {
    return (
        <React.Fragment>
            <Grid item xs={12}>
                <TextField
                    inputProps={{ ...register("title", { required: true }) }}
                    fullWidth
                    error={errors?.title ? true : false}
                    defaultValue={config?.title}
                    type="text"
                    label="Panel Title"
                />
            </Grid>

            <Grid item xs={12}>
                <TextField
                    inputProps={{ ...register("description") }}
                    fullWidth
                    error={errors?.description ? true : false}
                    defaultValue={config?.description}
                    type="text"
                    label="Description"
                />
            </Grid>

            <Grid item xs={12}>
                <TextField
                    inputProps={{ ...register("ip_address", { required: true }) }}
                    fullWidth
                    error={errors?.ip_address ? true : false}
                    defaultValue={config?.ip_address}
                    type="text"
                    label="IP Adrress"
                />
            </Grid>

            <Grid item xs={6}>
                <TextField
                    inputProps={{ ...register("username", { required: true }) }}
                    fullWidth
                    error={errors?.username ? true : false}
                    defaultValue={config?.username}
                    type="text"
                    label="Web Interface Username"
                />
            </Grid>

            <Grid item xs={6}>
                <TextField
                    inputProps={{ ...register("password", { required: true }) }}
                    fullWidth
                    error={errors?.password ? true : false}
                    defaultValue={config?.password}
                    type="password"
                    label="Web Interface Password"
                />
            </Grid>

            <Grid item xs={12}>
                <Button type="submit" variant="filled" color="default" size="large" disableElevation>
                    Save
                </Button>
            </Grid>
        </React.Fragment>
    );
}
