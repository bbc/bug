import React from "react";
import Grid from "@mui/material/Grid";
import BugConfigFormTextField from "@core/BugConfigFormTextField";
import BugConfigFormSelect from "@core/BugConfigFormSelect";
import TextField from "@mui/material/TextField";
import BugConfigFormSwitch from "@core/BugConfigFormSwitch";
import BugConfigFormChipInput from "@core/BugConfigFormChipInput";

export default function SecurityStrategyLocal({ strategy, errors, control }) {
    return (
        <>
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <BugConfigFormTextField
                        name="name"
                        control={control}
                        rules={{ required: true }}
                        fullWidth
                        defaultValue={strategy.name}
                        error={errors?.name}
                        label="Name"
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        variant="standard"
                        defaultValue={strategy.type.toUpperCase()}
                        disabled
                        type="text"
                        label="Type"
                    />
                </Grid>

                <Grid item xs={12}>
                    <BugConfigFormTextField
                        name="description"
                        control={control}
                        fullWidth
                        defaultValue={strategy.description}
                        error={errors?.description}
                        label="Description"
                    />
                </Grid>

                <Grid item xs={12}>
                    <BugConfigFormSwitch
                        name="enabled"
                        label="Enable this security type"
                        control={control}
                        defaultValue={strategy.enabled}
                        fullWidth
                        helperText="Make sure you have at least one user before enabling"
                    />
                </Grid>

                <Grid item xs={12}>
                    <BugConfigFormSelect
                        name="sessionLength"
                        control={control}
                        fullWidth
                        label="Session length"
                        defaultValue={strategy.sessionLength}
                        items={{
                            [-1]: "Unlimited",
                            60000: "1 minute",
                            1800000: "30 minutes",
                            3600000: "1 hour",
                            14400000: "4 hours",
                            86400000: "1 day",
                            172800000: "2 days",
                            604800000: "1 week",
                            1209600000: "2 weeks",
                            31536000000: "1 year",
                        }}
                    />
                </Grid>

                <Grid item xs={12}>
                    <BugConfigFormChipInput
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
