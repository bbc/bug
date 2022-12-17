import React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import BugConfigFormTextField from "@core/BugConfigFormTextField";
import BugConfigFormSelect from "@core/BugConfigFormSelect";
import BugConfigFormSwitch from "@core/BugConfigFormSwitch";
import BugConfigFormChipInput from "@core/BugConfigFormChipInput";

export default function SecurityStrategyOidc({ strategy, errors, control }) {
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
                        variant="standard"
                        fullWidth
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
                        variant="standard"
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
                        helperText="Make sure you have another security type configured and working before enabling"
                    />
                </Grid>

                <Grid item xs={12}>
                    <BugConfigFormSelect
                        name="sessionLength"
                        control={control}
                        fullWidth
                        label="Session length"
                        defaultValue={strategy.sessionLength}
                        options={[
                            { id: -1, label: "Unlimited" },
                            { id: 60000, label: "1 minute" },
                            { id: 1800000, label: "30 minutes" },
                            { id: 3600000, label: "1 hour" },
                            { id: 14400000, label: "4 hours" },
                            { id: 86400000, label: "1 day" },
                            { id: 172800000, label: "2 days" },
                            { id: 604800000, label: "1 week" },
                            { id: 1209600000, label: "2 weeks" },
                            { id: 31536000000, label: "1 year" },
                        ]}
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

                <Grid item xs={12}>
                    <BugConfigFormTextField
                        name="returnUrl"
                        control={control}
                        fullWidth
                        defaultValue={strategy.returnURL}
                        label="OpenID Return URL"
                    />
                </Grid>

                <Grid item xs={12}>
                    <BugConfigFormTextField
                        name="realm"
                        control={control}
                        fullWidth
                        defaultValue={strategy.realm}
                        label="OpenID Realm URL"
                    />
                </Grid>

                <Grid item xs={12}>
                    <BugConfigFormTextField
                        name="profileField"
                        control={control}
                        fullWidth
                        defaultValue={strategy.profileField}
                        label="User field"
                        helperText="The field name in the returned profile to use"
                    />
                </Grid>

                <Grid item xs={12}>
                    <BugConfigFormSelect
                        name="matchField"
                        control={control}
                        fullWidth
                        label="OIDC match field"
                        helperText="Which BUG user field to match against"
                        defaultValue={strategy.matchField}
                        options={[
                            { id: "email", label: "Email Address" },
                            { id: "username", label: "User name" },
                            { id: "name", label: "Name" },
                            { id: "id", label: "ID" },
                        ]}
                    />
                </Grid>
            </Grid>
        </>
    );
}
