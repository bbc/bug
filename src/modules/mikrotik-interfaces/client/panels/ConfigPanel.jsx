import React from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import ChipInput from "@core/ChipInput";
import PanelConfig from "@core/PanelConfig";
import Loading from "@components/Loading";
import { useSelector } from "react-redux";
import PasswordTextField from "@core/PasswordTextField";
import PanelGroupFormControl from "@core/PanelGroupFormControl";
import { useConfigFormHandler } from "@core/ConfigFormHandler";

export default function ConfigPanel() {
    const panelConfig = useSelector((state) => state.panelConfig);

    if (panelConfig.status === "loading") {
        return <Loading />;
    }

    if (panelConfig.status !== "success") {
        return null;
    }

    const { register, handleSubmit, control, errors, validateServer, messages } = useConfigFormHandler({
        panelId: panelConfig.data.id,
    });

    return (
        <>
            <PanelConfig config={panelConfig.data} handleSubmit={handleSubmit}>
                <Grid item xs={12}>
                    <TextField
                        inputProps={{ ...register("title", { required: true }) }}
                        required
                        fullWidth
                        error={errors.title}
                        defaultValue={panelConfig.data.title}
                        type="text"
                        label="Panel Title"
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        inputProps={{ ...register("description") }}
                        fullWidth
                        error={errors.description}
                        defaultValue={panelConfig.data.description}
                        type="text"
                        label="Description"
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <PanelGroupFormControl name="group" control={control} defaultValue={panelConfig.data.group} />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        //REGEX: Tests for IPv4 Addresses
                        inputProps={{
                            ...register("address", {
                                required: true,
                                pattern: /((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){4}/,
                            }),
                        }}
                        fullWidth
                        error={errors.address}
                        helperText={messages.address}
                        defaultValue={panelConfig.data.address}
                        onChange={(event) => validateServer(event, "address")}
                        type="text"
                        label="IP Address"
                    />
                </Grid>

                <Grid item xs={12} lg={6}>
                    <TextField
                        inputProps={{ ...register("username", { required: true }) }}
                        fullWidth
                        error={errors.username}
                        helperText={messages.username}
                        defaultValue={panelConfig.data.username}
                        onChange={(event) => validateServer(event, "username", ["address", "password"])}
                        type="text"
                        label="Username"
                    />
                </Grid>

                <Grid item xs={12} lg={6}>
                    <PasswordTextField
                        inputProps={{ ...register("password", { required: true }) }}
                        fullWidth
                        error={errors.password}
                        helperText={messages.password}
                        defaultValue={panelConfig.data.password}
                        onChange={(event) => validateServer(event, "username", ["address", "username"])}
                        type="password"
                        label="Password"
                    />
                </Grid>

                <Grid item xs={12}>
                    <ChipInput
                        name="protectedInterfaces"
                        label="Protected Interfaces"
                        control={control}
                        defaultValue={panelConfig.data.protectedInterfaces}
                        sort={true}
                        error={errors.protectedInterfaces}
                        fullWidth
                    />
                </Grid>

                <Grid item xs={12}>
                    <ChipInput
                        name="excludedInterfaces"
                        label="Excluded Interfaces"
                        control={control}
                        defaultValue={panelConfig.data.excludedInterfaces}
                        sort={true}
                        error={errors.excludedInterfaces}
                        fullWidth
                    />
                </Grid>
            </PanelConfig>
        </>
    );
}
