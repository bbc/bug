import React from "react";
import Grid from "@mui/material/Grid";
import BugConfigFormTextField from "@core/BugConfigFormTextField";
import Button from "@mui/material/Button";

export default function ConfigPanel({ register, errors, config }) {
    return (
        <React.Fragment>
            <Grid item xs={12}>
                <BugConfigFormTextField
                    inputProps={{ ...register("title", { required: true }) }}
                    fullWidth
                    variant="standard"
                    error={errors?.title ? true : false}
                    defaultValue={config?.title}
                    type="text"
                    label="Panel Title"
                />
            </Grid>

            <Grid item xs={12}>
                <BugConfigFormTextField
                    inputProps={{ ...register("description") }}
                    fullWidth
                    variant="standard"
                    error={errors?.description ? true : false}
                    defaultValue={config?.description}
                    type="text"
                    label="Description"
                />
            </Grid>

            <Grid item xs={12}>
                <BugConfigFormTextField
                    inputProps={{ ...register("ip_address", { required: true }) }}
                    fullWidth
                    variant="standard"
                    error={errors?.ip_address ? true : false}
                    defaultValue={config?.ip_address}
                    type="text"
                    label="IP Adrress"
                />
            </Grid>

            <Grid item xs={6}>
                <BugConfigFormTextField
                    inputProps={{ ...register("username", { required: true }) }}
                    fullWidth
                    variant="standard"
                    error={errors?.username ? true : false}
                    defaultValue={config?.username}
                    type="text"
                    label="Web Interface Username"
                />
            </Grid>

            <Grid item xs={6}>
                <BugConfigFormTextField
                    inputProps={{ ...register("password", { required: true }) }}
                    fullWidth
                    variant="standard"
                    error={errors?.password ? true : false}
                    defaultValue={config?.password}
                    type="password"
                    label="Web Interface Password"
                />
            </Grid>

            <Grid item xs={12}>
                <Button type="submit" variant="standard" color="default" size="large" disableElevation>
                    Save
                </Button>
            </Grid>
        </React.Fragment>
    );
}
