import React from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import ConfigFormSwitch from "@core/ConfigFormSwitch";

export default function SecurityStrategySaml({ strategy, register, errors, control }) {
    return (
        <>
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <TextField
                        inputProps={{
                            ...register("name", {
                                required: true,
                            }),
                        }}
                        fullWidth
                        defaultValue={strategy.name}
                        error={errors?.name ? true : false}
                        type="text"
                        label="Name"
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField fullWidth defaultValue={strategy.type.toUpperCase()} disabled type="text" label="Type" />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        inputProps={{
                            ...register("description"),
                        }}
                        fullWidth
                        defaultValue={strategy.description}
                        error={errors?.description ? true : false}
                        type="text"
                        label="Description"
                    />
                </Grid>

                <Grid item xs={12}>
                    <ConfigFormSwitch
                        name="enabled"
                        label="Enable this security type"
                        control={control}
                        defaultValue={strategy.enabled}
                        fullWidth
                        helperText="Make sure you have another security type configured and working before enabling"
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        inputProps={{
                            ...register("loginPath"),
                        }}
                        fullWidth
                        defaultValue={strategy.loginPath}
                        type="text"
                        label="SAML Login Page"
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        inputProps={{
                            ...register("entryPoint"),
                        }}
                        fullWidth
                        defaultValue={strategy.entryPoint}
                        type="text"
                        label="SAML entry point"
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        inputProps={{
                            ...register("issuer"),
                        }}
                        fullWidth
                        defaultValue={strategy.issuer}
                        type="text"
                        label="SAML issuer"
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        inputProps={{
                            ...register("identifierFormat"),
                        }}
                        fullWidth
                        defaultValue={strategy.identifierFormat}
                        type="text"
                        label="SAML identifier format"
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        inputProps={{
                            ...register("profileFeild"),
                        }}
                        fullWidth
                        defaultValue={strategy.profileFeild}
                        type="text"
                        label="User field"
                        helperText="The feild name in the returned profile to use"
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        select
                        inputProps={{
                            ...register("matchFeild"),
                        }}
                        fullWidth
                        label="SAML match field"
                        helperText="Which BUG user field to match against"
                        defaultValue={strategy.matchFeild}
                        SelectProps={{
                            native: true,
                        }}
                    >
                        <option value="">None</option>
                        <option value="email">Email Address</option>
                        <option value="username">User name</option>
                        <option value="name">Name</option>
                        <option value="id">ID</option>
                    </TextField>
                </Grid>
            </Grid>
        </>
    );
}
