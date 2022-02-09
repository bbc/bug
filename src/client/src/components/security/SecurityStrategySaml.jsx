import React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import BugConfigFormTextField from "@core/BugConfigFormTextField";
import BugConfigFormSelect from "@core/BugConfigFormSelect";
import BugConfigFormSwitch from "@core/BugConfigFormSwitch";

export default function SecurityStrategySaml({ strategy, register, errors, control }) {
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
                    <BugConfigFormTextField
                        name="loginPath"
                        control={control}
                        fullWidth
                        defaultValue={strategy.loginPath}
                        label="SAML Login Page"
                    />
                </Grid>

                <Grid item xs={12}>
                    <BugConfigFormTextField
                        name="entryPoint"
                        control={control}
                        fullWidth
                        defaultValue={strategy.entryPoint}
                        label="SAML entry point"
                    />
                </Grid>

                <Grid item xs={12}>
                    <BugConfigFormTextField
                        name="issuer"
                        control={control}
                        fullWidth
                        defaultValue={strategy.issuer}
                        label="SAML issuer"
                    />
                </Grid>

                <Grid item xs={12}>
                    <BugConfigFormTextField
                        name="identifierFormat"
                        control={control}
                        fullWidth
                        defaultValue={strategy.identifierFormat}
                        label="SAML identifier format"
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
                        label="SAML match field"
                        helperText="Which BUG user field to match against"
                        defaultValue={strategy.matchField}
                        items={{
                            email: "Email Address",
                            username: "User name",
                            name: "Name",
                            id: "ID",
                        }}
                    />
                </Grid>
            </Grid>
        </>
    );
}
