import React from "react";
import Grid from "@mui/material/Grid";
import BugConfigFormTextField from "@core/BugConfigFormTextField";
import BugConfigWrapper from "@core/BugConfigWrapper";
import BugLoading from "@core/BugLoading";
import { useSelector } from "react-redux";
import BugConfigFormPasswordTextField from "@core/BugConfigFormPasswordTextField";
import BugConfigFormPanelGroup from "@core/BugConfigFormPanelGroup";
import { useConfigFormHandler } from "@hooks/ConfigFormHandler";
import BugConfigFormSelect from "@core/BugConfigFormSelect";

export default function ConfigPanel() {
    const panelConfig = useSelector((state) => state.panelConfig);

    if (panelConfig.status === "loading") {
        return <BugLoading />;
    }

    if (panelConfig.status !== "success") {
        return null;
    }

    const { handleSubmit, control, validateServer, errors, messages } = useConfigFormHandler({
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
                    <BugConfigFormTextField
                        name="address"
                        control={control}
                        rules={{ required: true }}
                        fullWidth
                        error={errors?.address}
                        helperText={messages.address}
                        defaultValue={panelConfig.data.address}
                        supportsValidation={true}
                        onChange={(event) => validateServer(event, "address")}
                        label="IP Address"
                    />
                </Grid>

                <Grid item xs={6}>
                    <BugConfigFormTextField
                        name="username"
                        control={control}
                        rules={{ required: true }}
                        fullWidth
                        error={errors?.username}
                        helperText={messages.username}
                        defaultValue={panelConfig.data.username}
                        supportsValidation={true}
                        onChange={(event) => validateServer(event, "username", ["address", " username", "password"])}
                        label="Web Interface Username"
                    />
                </Grid>

                <Grid item xs={6}>
                    <BugConfigFormPasswordTextField
                        name="password"
                        control={control}
                        rules={{ required: true }}
                        fullWidth
                        error={errors?.password}
                        helperText={messages.password}
                        defaultValue={panelConfig.data.password}
                        supportsValidation={true}
                        onChange={(event) => validateServer(event, "password", ["address", "username", "password"])}
                        label="Web Interface Password"
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <BugConfigFormPanelGroup name="group" control={control} defaultValue={panelConfig.data.group} />
                </Grid>

                <Grid item xs={6}>
                    <BugConfigFormSelect
                        name="model"
                        control={control}
                        fullWidth
                        error={errors?.model}
                        defaultValue={panelConfig.data.model}
                        label="Model"
                        rules={{ required: true }}
                        options={[
                            { id: "tsl-mdu-12-pm", label: "TSL MDU 12 PM" },
                            { id: "tsl-mdu-3es", label: "TSL MDU 3ES" },
                        ]}
                    />
                </Grid>
            </BugConfigWrapper>
        </>
    );
}
