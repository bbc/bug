import React from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import ConfigFormSwitch from "@core/ConfigFormSwitch";
import ConfigFormChipInput from "@core/ConfigFormChipInput";

export default function SecurityStrategyLocal({ strategy, register, errors, control }) {
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
                        helperText="Make sure you have at least one user before enabling"
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        select
                        inputProps={{
                            ...register("sessionLength"),
                        }}
                        fullWidth
                        label="Session length"
                        defaultValue={strategy.sessionLength}
                        SelectProps={{
                            native: true,
                        }}
                    >
                        <option value={-1}>Unlimited</option>
                        <option value={60000}>1 minute</option>
                        <option value={1800000}>30 minutes</option>
                        <option value={3600000}>1 hour</option>
                        <option value={14400000}>4 hours</option>
                        <option value={86400000}>1 day</option>
                        <option value={172800000}>2 days</option>
                        <option value={604800000}>1 week</option>
                        <option value={1209600000}>2 weeks</option>
                        <option value={31536000000}>1 year</option>
                    </TextField>
                </Grid>

                <Grid item xs={12}>
                    <ConfigFormChipInput
                        name="sourceFilterList"
                        label="Source filter list"
                        control={control}
                        defaultValue={strategy.sourceFilterList}
                        sort={true}
                        error={errors.sourceFilterList}
                        fullWidth
                        helperText="Only allow this security type from these addresses"
                    />
                </Grid>
            </Grid>
        </>
    );
}
