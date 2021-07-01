import React from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import ConfigFormSwitch from "@core/ConfigFormSwitch";

export default function SecurityStrategyProxy({ strategy, register, errors, control }) {
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
                    <TextField fullWidth defaultValue={strategy.type} disabled type="text" label="Type" />
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
                            ...register("headerField"),
                        }}
                        fullWidth
                        defaultValue={strategy.headerField}
                        type="text"
                        label="Proxy header field"
                        helperText="The name of the HTTP header field to use"
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        select
                        inputProps={{
                            ...register("headerFieldMatch"),
                        }}
                        fullWidth
                        label="Proxy match field"
                        helperText="Which BUG user field to match against"
                        defaultValue={strategy.headerFieldMatch}
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
