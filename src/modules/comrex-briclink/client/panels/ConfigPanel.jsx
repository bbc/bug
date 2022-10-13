import React from "react";
import Grid from "@mui/material/Grid";
import BugConfigFormTextField from "@core/BugConfigFormTextField";
import BugLoading from "@core/BugLoading";
import { useSelector } from "react-redux";
import BugConfigFormPanelGroup from "@core/BugConfigFormPanelGroup";
import { useConfigFormHandler } from "@hooks/ConfigFormHandler";
import BugConfigWrapper from "@core/BugConfigWrapper";
import BugConfigFormPasswordTextField from "@core/BugConfigFormPasswordTextField";
import BugConfigFormSelect from "@core/BugConfigFormSelect";
import InputAdornment from "@mui/material/InputAdornment";
import BugConfigFormPanelSelect from "@core/BugConfigFormPanelSelect";

export default function ConfigPanel() {
    const panelConfig = useSelector((state) => state.panelConfig);

    if (panelConfig.status === "loading") {
        return <BugLoading />;
    }

    if (panelConfig.status !== "success") {
        return null;
    }

    const { register, handleSubmit, control, errors, validateServer, messages } = useConfigFormHandler({
        panelId: panelConfig.data.id,
    });

    return (
        <>
            <BugConfigWrapper config={panelConfig.data} handleSubmit={handleSubmit}>
                <Grid item xs={12}>
                    <BugConfigFormTextField
                        name="title"
                        control={control}
                        rules={{ required: true }}
                        fullWidth
                        error={errors.title}
                        defaultValue={panelConfig.data.title}
                        label="Panel Title"
                    />
                </Grid>
                <Grid item xs={12}>
                    <BugConfigFormTextField
                        name="description"
                        control={control}
                        fullWidth
                        error={errors.description}
                        defaultValue={panelConfig.data.description}
                        label="Description"
                    />
                </Grid>
                <Grid item xs={12}>
                    <BugConfigFormPanelGroup name="group" control={control} defaultValue={panelConfig.data.group} />
                </Grid>

                <Grid item xs={12}>
                    <BugConfigFormTextField
                        name="address"
                        control={control}
                        rules={{ required: true }}
                        fullWidth
                        error={errors.address}
                        helperText={messages.address}
                        defaultValue={panelConfig.data.address}
                        supportsValidation
                        onChange={(event) => validateServer(event, "address")}
                        label="IP Address"
                    />
                </Grid>

                <Grid item xs={12} lg={6}>
                    <BugConfigFormTextField
                        name="username"
                        control={control}
                        rules={{ required: true }}
                        fullWidth
                        error={errors.username}
                        helperText={messages.username}
                        defaultValue={panelConfig.data.username}
                        supportsValidation
                        onChange={(event) =>
                            validateServer(event, "username", ["address", "username", "password", "port"])
                        }
                        label="Username"
                    />
                </Grid>

                <Grid item xs={12} lg={6}>
                    <BugConfigFormPasswordTextField
                        name="password"
                        control={control}
                        rules={{ required: true }}
                        fullWidth
                        error={errors.password}
                        helperText={messages.password}
                        defaultValue={panelConfig.data.password}
                        supportsValidation
                        onChange={(event) =>
                            validateServer(event, "username", ["address", "username", "password", "port"])
                        }
                        label="Password"
                    />
                </Grid>

                <Grid item xs={6}>
                    <BugConfigFormSelect
                        name="port"
                        control={control}
                        fullWidth
                        label="Control Port"
                        defaultValue={panelConfig.data.port}
                        options={[
                            { id: "80", label: "80 (v4 firmware)" },
                            { id: "8080", label: "8080 (v2/v3 firmware)" },
                        ]}
                    />
                </Grid>

                <Grid item xs={6}>
                    <BugConfigFormTextField
                        name="delay"
                        control={control}
                        fullWidth
                        error={errors.delay}
                        defaultValue={panelConfig.data.delay === undefined ? 100 : panelConfig.data.delay}
                        label="Maximum Delay"
                        filter={/[^0-9]/}
                        numeric
                        min={0}
                        max={2000}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">ms</InputAdornment>,
                        }}
                    />
                </Grid>

                <Grid item xs={6}>
                    <BugConfigFormTextField
                        name="jitter"
                        control={control}
                        fullWidth
                        error={errors.delay}
                        defaultValue={panelConfig.data.jitter === undefined ? 50 : panelConfig.data.jitter}
                        label="Maximum Jitter"
                        filter={/[^0-9]/}
                        numeric
                        min={0}
                        max={500}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">ms</InputAdornment>,
                        }}
                    />
                </Grid>

                <Grid item xs={6}>
                    <BugConfigFormTextField
                        name="loss"
                        control={control}
                        fullWidth
                        error={errors.delay}
                        defaultValue={panelConfig.data.loss === undefined ? 5 : panelConfig.data.loss}
                        label="Maximum Loss"
                        filter={/[^0-9]/}
                        numeric
                        min={0}
                        max={500}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        }}
                    />
                </Grid>

                <Grid item xs={12} md={12}>
                    <BugConfigFormPanelSelect
                        name="codecSource"
                        label="Codec Database Source"
                        control={control}
                        defaultValue={panelConfig.data.codecSource ?? ""}
                        error={errors.codecSource}
                        helperText="Select a source of codec information"
                        fullWidth
                        capability="codec-db"
                    />
                </Grid>
            </BugConfigWrapper>
        </>
    );
}
